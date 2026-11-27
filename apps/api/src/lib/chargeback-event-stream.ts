import { EvStreamManager, type EvMessage } from "evstream";
import { appendFile, mkdir, readFile, readdir } from "node:fs/promises";
import { basename, resolve } from "node:path";

export const chargebackEventsChannel = "chargeback.events";

export interface ChargebackStreamEvent {
  readonly id: string;
  readonly type: string;
  readonly disputeId?: string;
  readonly data: unknown;
  readonly recordedAt?: string;
}

const disputeEventHistory = new Map<string, ChargebackStreamEvent[]>();
const disputeRunWrites = new Map<string, Promise<void>>();
const apiWorkingDirectory = basename(process.cwd()) === "api"
  ? process.cwd()
  : resolve(process.cwd(), "apps/api");
const disputeRunDirectory = process.env.DISPUTE_RUNS_DIR
  ? resolve(process.cwd(), process.env.DISPUTE_RUNS_DIR)
  : resolve(apiWorkingDirectory, "data/dispute-runs");

export const chargebackEventStreamManager = new EvStreamManager({
  id: "chargeback-api",
  maxConnection: 5000,
  maxListeners: 5000,
});

export function getChargebackDisputeChannel(disputeId: string): string {
  return `${chargebackEventsChannel}:dispute:${disputeId}`;
}

export function getChargebackDisputeEvents(disputeId: string): ChargebackStreamEvent[] {
  return [...(disputeEventHistory.get(disputeId) ?? [])];
}

export async function readChargebackDisputeRun(disputeId: string): Promise<ChargebackStreamEvent[]> {
  await disputeRunWrites.get(disputeId);
  try {
    const contents = await readFile(disputeRunFile(disputeId), "utf8");
    return contents.split("\n").filter(Boolean).map((line) => JSON.parse(line) as ChargebackStreamEvent);
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") return [];
    throw error;
  }
}

export async function readChargebackDemoRunTemplates(): Promise<ChargebackStreamEvent[][]> {
  let files: string[];
  try {
    files = await readdir(disputeRunDirectory);
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") return [];
    throw error;
  }
  const templates: ChargebackStreamEvent[][] = [];
  for (const file of files.filter((name) => name.endsWith(".jsonl")).sort()) {
    const contents = await readFile(resolve(disputeRunDirectory, file), "utf8");
    const events = contents.split("\n").filter(Boolean).map((line) => JSON.parse(line) as ChargebackStreamEvent);
    const received = events.find((event) => event.type === "chargeback.dispute.received");
    const receivedData = typeof received?.data === "object" && received.data !== null ? received.data as Record<string, unknown> : {};
    const includesDemoEvent = events.some((event) => typeof event.data === "object" && event.data !== null && (event.data as Record<string, unknown>).demoRun === true);
    const completed = events.some((event) => event.type === "dispute.processing.ended");
    if (received && receivedData.provider !== "demo" && !includesDemoEvent && completed) templates.push(events);
  }
  return templates;
}

export function publishChargebackStreamEvent(event: ChargebackStreamEvent): void {
  const recordedEvent = { ...event, recordedAt: event.recordedAt ?? new Date().toISOString() };
  const message: EvMessage = {
    event: recordedEvent.type,
    id: recordedEvent.id,
    data: {
      id: recordedEvent.id,
      type: recordedEvent.type,
      disputeId: recordedEvent.disputeId ?? null,
      data: recordedEvent.data,
      recordedAt: recordedEvent.recordedAt,
    },
  };

  chargebackEventStreamManager.send(chargebackEventsChannel, message);

  if (recordedEvent.disputeId) {
    const history = disputeEventHistory.get(recordedEvent.disputeId) ?? [];
    history.push(recordedEvent);
    if (history.length > 100) history.shift();
    disputeEventHistory.set(recordedEvent.disputeId, history);
    chargebackEventStreamManager.send(
      getChargebackDisputeChannel(recordedEvent.disputeId),
      message,
    );
    const previousWrite = disputeRunWrites.get(recordedEvent.disputeId) ?? Promise.resolve();
    const nextWrite = previousWrite.catch(() => undefined).then(async () => {
      await mkdir(disputeRunDirectory, { recursive: true });
      await appendFile(disputeRunFile(recordedEvent.disputeId!), `${JSON.stringify(recordedEvent)}\n`, "utf8");
    });
    disputeRunWrites.set(recordedEvent.disputeId, nextWrite);
    void nextWrite.catch((error: unknown) => {
      console.error(`Could not persist dispute run ${recordedEvent.disputeId}`, error);
    });
  }
}

function disputeRunFile(disputeId: string): string {
  return resolve(disputeRunDirectory, `${encodeURIComponent(disputeId)}.jsonl`);
}
