import type { Id, IsoDate } from "./events.js";

export interface ChargebackDisputeRecord {
  readonly id: Id;
  readonly merchantId: Id;
  readonly provider: string;
  readonly externalId: string;
  readonly providerStatus: string;
  readonly responseDeadline: IsoDate | null;
}

export interface InvestigationRunRecord {
  readonly id: Id;
  readonly disputeId: Id;
  readonly status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  readonly startedAt: IsoDate | null;
  readonly completedAt: IsoDate | null;
}

export interface ChargebackCaseRepository {
  getDispute(disputeId: Id): Promise<ChargebackDisputeRecord | null>;
  createInvestigationRun(input: {
    disputeId: Id;
    startedAt: IsoDate;
  }): Promise<InvestigationRunRecord>;
  recordAgentExecution(input: {
    investigationRunId: Id;
    agentId: string;
    status: AgentExecutionStatus;
    summary: string;
    completedAt: IsoDate;
  }): Promise<void>;
}

export type AgentExecutionStatus = "COMPLETED" | "FAILED" | "WAITING_FOR_APPROVAL";

