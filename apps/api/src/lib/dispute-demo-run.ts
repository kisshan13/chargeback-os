import { readChargebackDemoRunTemplates, publishChargebackStreamEvent, type ChargebackStreamEvent } from "./chargeback-event-stream.js";
import type { Customer, Dispute, DisputeReasonCode, Merchant, Order, Payment, Transaction } from "@packages/synthetic-data";

type DemoRunContext = {
  dispute: Dispute;
  payment: Payment;
  transaction: Transaction;
  reasonCode: DisputeReasonCode;
  customer?: Customer;
  order?: Order;
  merchant?: Merchant;
};

const replayIntervalMs = 240;
const timestampKeys = new Set(["recordedAt", "startedAt", "endedAt", "createdAt", "producedAt", "occurredAt"]);
const pendingDemoApprovals = new Map<string, string>();

export async function replayStoredDisputeDemo(context: DemoRunContext): Promise<number | null> {
  const templates = await readChargebackDemoRunTemplates();
  if (templates.length === 0) return null;

  const template = templates.find((events) => eventReasonCode(events) === context.reasonCode.code) ?? templates[0]!;
  const received = template.find((event) => event.type === "chargeback.dispute.received");
  const receivedData = asRecord(received?.data);
  const rawPayload = asRecord(receivedData.rawPayload);
  const sourceDispute = asRecord(rawPayload.dispute);
  const sourcePayment = findEmbeddedRecord(template, sourceDispute.paymentId);
  const sourceOrder = findEmbeddedRecord(template, sourcePayment.orderId);
  const sourceCustomer = findEmbeddedRecord(template, sourcePayment.customerId);
  const sourceMerchant = findEmbeddedRecord(template, sourceDispute.merchantId);
  const sourceEvents = template;
  const sourceStart = Date.parse(sourceEvents[0]?.recordedAt ?? "");
  const sourceEnd = Date.parse(sourceEvents.at(-1)?.recordedAt ?? "");
  const replayStartedAt = Date.now();
  const replayDurationMs = Math.max(0, (template.length - 1) * replayIntervalMs);
  const sourceDurationMs = Number.isFinite(sourceStart) && Number.isFinite(sourceEnd) ? Math.max(0, sourceEnd - sourceStart) : 0;
  const timeScale = sourceDurationMs > 0 ? replayDurationMs / sourceDurationMs : 0;

  const replacements = new Map<string, string>();
  addReplacement(replacements, sourceDispute.id, context.dispute.id);
  addReplacement(replacements, sourceDispute.externalId, context.dispute.externalId);
  addReplacement(replacements, sourceDispute.paymentId, context.payment.id);
  addReplacement(replacements, sourceDispute.transactionId, context.transaction.id);
  addReplacement(replacements, sourceDispute.merchantId, context.dispute.merchantId);
  addReplacement(replacements, sourceDispute.sourceSystemId, context.dispute.sourceSystemId);
  addReplacement(replacements, sourceDispute.reasonCodeId, context.reasonCode.id);
  addReplacement(replacements, sourceDispute.customerClaim, context.dispute.customerClaim);
  addReplacement(replacements, sourceDispute.currency, context.dispute.currency);
  addReplacement(replacements, receivedData.paymentExternalId, context.payment.externalId);
  addReplacement(replacements, receivedData.transactionExternalId, context.transaction.externalId);
  addReplacement(replacements, receivedData.reasonCode, context.reasonCode.code);
  addReplacement(replacements, receivedData.responseDeadline, context.dispute.responseDeadline);
  addReplacement(replacements, receivedData.merchantId, context.dispute.merchantId);
  addReplacement(replacements, receivedData.currency, context.dispute.currency);
  addReplacement(replacements, sourcePayment.orderId, context.payment.orderId);
  addReplacement(replacements, sourcePayment.customerId, context.payment.customerId);
  addReplacement(replacements, sourcePayment.paymentMethodId, context.payment.paymentMethodId);
  addReplacement(replacements, sourceOrder.externalId, context.order?.externalId);
  addReplacement(replacements, sourceCustomer.firstName, context.customer?.firstName);
  addReplacement(replacements, sourceCustomer.lastName, context.customer?.lastName);
  addReplacement(replacements, sourceCustomer.email, context.customer?.email);
  addReplacement(replacements, sourceMerchant.name, context.merchant?.name);
  if (typeof sourceDispute.amountMinor === "number") replacements.set(String(sourceDispute.amountMinor), String(context.dispute.amountMinor));
  if (typeof receivedData.amountMinor === "number") replacements.set(String(receivedData.amountMinor), String(context.dispute.amountMinor));

  const eventFrames = template.map((event, index) => {
    let data = transformValue(event.data, undefined, replacements, sourceStart, replayStartedAt, timeScale, sourceDispute.amountMinor, context.dispute.amountMinor);
    if (event.type === "chargeback.dispute.received") {
      data = {
        ...asRecord(data),
        provider: "demo",
        providerEventType: "chargeback.dispute.demo_replay",
        disputeExternalId: context.dispute.externalId,
        paymentExternalId: context.payment.externalId,
        transactionExternalId: context.transaction.externalId,
        merchantId: context.dispute.merchantId,
        amountMinor: context.dispute.amountMinor,
        currency: context.dispute.currency,
        reasonCode: context.reasonCode.code,
        responseDeadline: context.dispute.responseDeadline,
        rawPayload: { dispute: context.dispute, simulation: true, demoRun: true },
      };
    }
    if (event.type === "dispute.processing.started") {
      data = { ...asRecord(data), status: "started", startedAt: new Date(replayStartedAt).toISOString(), demoRun: true };
    }
    if (event.type === "dispute.processing.ended") {
      data = { ...asRecord(data), status: "completed", endedAt: new Date(replayStartedAt + replayDurationMs).toISOString(), demoRun: true };
    }
    if (event.type !== "chargeback.dispute.received" && event.type !== "dispute.processing.started" && event.type !== "dispute.processing.ended") {
      data = { ...asRecord(data), demoRun: true };
    }
    return {
      id: `${context.dispute.id}:demo:${index}`,
      type: event.type,
      disputeId: context.dispute.id,
      data,
      recordedAt: new Date(replayStartedAt + index * replayIntervalMs).toISOString(),
    } satisfies ChargebackStreamEvent;
  });

  const [first, ...remaining] = eventFrames;
  if (first) publishChargebackStreamEvent(first);
  void replayFrames(remaining).then(() => publishDemoApproval(context, eventFrames)).catch((error: unknown) => {
    console.error(`Could not replay stored demo run for dispute ${context.dispute.id}`, error);
  });
  return eventFrames.length + 1;
}

export function decideStoredDisputeDemoApproval(disputeId: string, approvalId: string, decision: "approved" | "rejected", note?: string): boolean {
  if (pendingDemoApprovals.get(disputeId) !== approvalId) return false;
  pendingDemoApprovals.delete(disputeId);
  const decidedAt = new Date().toISOString();
  publishChargebackStreamEvent({
    id: `${disputeId}:demo:approval-decided`,
    type: "dispute.approval.decided",
    disputeId,
    data: { approvalId, decision, note, decidedAt, demoRun: true },
    recordedAt: decidedAt,
  });
  publishChargebackStreamEvent({
    id: `${disputeId}:demo:processing-ended-after-approval`,
    type: "dispute.processing.ended",
    disputeId,
    data: { status: "completed", endedAt: decidedAt, demoRun: true },
    recordedAt: decidedAt,
  });
  return true;
}

function publishDemoApproval(context: DemoRunContext, events: ChargebackStreamEvent[]): void {
  const approvalId = `${context.dispute.id}:demo-approval`;
  const requestedAt = new Date().toISOString();
  pendingDemoApprovals.set(context.dispute.id, approvalId);
  const evidence = events.filter((event) => event.type === "chargeback.evidence.collected" || event.type === "chargeback.evidence.requested").map((event) => event.data);
  const findings = events.filter((event) => event.type === "chargeback.finding.created" || event.type === "chargeback.contradiction.detected").map((event) => event.data);
  const resolutions = events.filter((event) => event.type === "chargeback.resolution.proposed").map((event) => event.data);
  const proposal = asRecord(resolutions.at(-1));
  publishChargebackStreamEvent({
    id: `${context.dispute.id}:demo:approval-required`,
    type: "dispute.approval.required",
    disputeId: context.dispute.id,
    recordedAt: requestedAt,
    data: {
      approvalId,
      participantName: "Dispute Response Reviewer",
      requestedAt,
      proposedResponse: {
        recommendation: proposal.recommendation ?? proposal.proposalType ?? "Review the dispute response",
        rationale: proposal.rationale ?? proposal.description ?? "Review the saved investigation findings before deciding.",
      },
      caseContext: {
        dispute: context.dispute,
        customer: context.customer ?? null,
        payment: context.payment,
        transaction: context.transaction,
        order: context.order ?? null,
        merchant: context.merchant ?? null,
        reasonCode: context.reasonCode,
      },
      evidence,
      findings,
      resolutions,
      demoRun: true,
    },
  });
}

async function replayFrames(events: ChargebackStreamEvent[]): Promise<void> {
  for (const event of events) {
    await new Promise<void>((resolve) => setTimeout(resolve, replayIntervalMs));
    publishChargebackStreamEvent(event);
  }
}

function transformValue(
  value: unknown,
  key: string | undefined,
  replacements: Map<string, string>,
  sourceStart: number,
  replayStartedAt: number,
  timeScale: number,
  sourceAmount: unknown,
  targetAmount: number,
): unknown {
  if (Array.isArray(value)) return value.map((item) => transformValue(item, key, replacements, sourceStart, replayStartedAt, timeScale, sourceAmount, targetAmount));
  if (typeof value === "number") return typeof sourceAmount === "number" && value === sourceAmount ? targetAmount : value;
  if (typeof value === "string") {
    if ((key === "agentName" || key === "participantName") && value.length > 20 && value.includes("-")) return "Dispute Investigation Agent";
    if (key && timestampKeys.has(key)) {
      const sourceTime = Date.parse(value);
      if (Number.isFinite(sourceTime) && Number.isFinite(sourceStart)) {
        return new Date(replayStartedAt + Math.max(0, sourceTime - sourceStart) * timeScale).toISOString();
      }
    }
    let result = value;
    for (const [source, target] of replacements) result = result.replaceAll(source, target);
    return result;
  }
  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(Object.entries(value).map(([entryKey, entryValue]) => [
      entryKey,
      transformValue(entryValue, entryKey, replacements, sourceStart, replayStartedAt, timeScale, sourceAmount, targetAmount),
    ]));
  }
  return value;
}

function addReplacement(replacements: Map<string, string>, source: unknown, target: unknown): void {
  if (typeof source === "string" && source.length > 0 && typeof target === "string" && target.length > 0 && source !== target) {
    replacements.set(source, target);
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? value as Record<string, unknown> : {};
}

function eventReasonCode(events: ChargebackStreamEvent[]): unknown {
  const received = events.find((event) => event.type === "chargeback.dispute.received");
  return asRecord(received?.data).reasonCode;
}

function findEmbeddedRecord(value: unknown, id: unknown): Record<string, unknown> {
  if (typeof id !== "string" || !id) return {};
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findEmbeddedRecord(item, id);
      if (Object.keys(found).length > 0) return found;
    }
  } else if (typeof value === "object" && value !== null) {
    const record = value as Record<string, unknown>;
    if (record.id === id) return record;
    for (const item of Object.values(record)) {
      const found = findEmbeddedRecord(item, id);
      if (Object.keys(found).length > 0) return found;
    }
  } else if (typeof value === "string" && (value.startsWith("{") || value.startsWith("["))) {
    try { return findEmbeddedRecord(JSON.parse(value) as unknown, id); } catch { return {}; }
  }
  return {};
}
