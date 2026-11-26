import { RuntimeState } from "@mozaik-ai/core";
import type { ChargebackSemanticEvent, Id, IsoDate } from "../contracts/events.js";

export interface AgentRunSnapshot {
  readonly runId: Id;
  readonly agentId: string;
  readonly eventId: Id;
  readonly status: "RUNNING" | "COMPLETED" | "FAILED" | "WAITING_FOR_APPROVAL";
  readonly startedAt: IsoDate;
  readonly completedAt: IsoDate | null;
}

export interface RuntimeSnapshot {
  readonly processedEventKeys: readonly string[];
  readonly publishedEventIds: readonly Id[];
  readonly agentRuns: readonly AgentRunSnapshot[];
}

export class ChargebackRuntimeState extends RuntimeState {
  private readonly processedEventKeys = new Set<string>();
  private readonly publishedEventIds = new Set<Id>();
  private readonly agentRuns = new Map<Id, AgentRunSnapshot>();

  hasProcessedEvent(key: string): boolean {
    return this.processedEventKeys.has(key);
  }

  recordEvent(event: ChargebackSemanticEvent): void {
    this.processedEventKeys.add(event.idempotencyKey);
    this.publishedEventIds.add(event.id);
  }

  startAgentRun(input: Omit<AgentRunSnapshot, "status" | "completedAt">): void {
    this.agentRuns.set(input.runId, {
      ...input,
      status: "RUNNING",
      completedAt: null,
    });
  }

  finishAgentRun(
    runId: Id,
    status: AgentRunSnapshot["status"],
    completedAt: IsoDate,
  ): void {
    const run = this.agentRuns.get(runId);
    if (!run) {
      return;
    }

    this.agentRuns.set(runId, { ...run, status, completedAt });
  }

  snapshot(): RuntimeSnapshot {
    return {
      processedEventKeys: [...this.processedEventKeys],
      publishedEventIds: [...this.publishedEventIds],
      agentRuns: [...this.agentRuns.values()],
    };
  }
}

