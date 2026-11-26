export type Id = string;
export type IsoDate = string;

export type PaymentProvider =
  | "stripe"
  | "dodo_payments"
  | "lemonsqueezy"
  | (string & {});

export const CHARGEBACK_EVENT_TYPES = {
  disputeReceived: "chargeback.dispute.received",
  disputeReconciled: "chargeback.dispute.reconciled",
  investigationStarted: "chargeback.investigation.started",
  evidenceCollected: "chargeback.evidence.collected",
  findingCreated: "chargeback.finding.created",
  contradictionDetected: "chargeback.contradiction.detected",
  resolutionProposed: "chargeback.resolution.proposed",
  responseSubmitted: "chargeback.response.submitted",
  providerStatusChanged: "chargeback.provider.status_changed",
  responseDeadlineApproaching: "chargeback.response_deadline.approaching",
} as const;

export type ChargebackEventType =
  (typeof CHARGEBACK_EVENT_TYPES)[keyof typeof CHARGEBACK_EVENT_TYPES];

export interface ProviderEventEnvelope {
  provider: PaymentProvider;
  externalEventId: string;
  providerEventType: string;
  receivedAt: IsoDate;
  payload: unknown;
  signature?: string;
  headers?: Readonly<Record<string, string>>;
}

export interface ChargebackSemanticEvent<TPayload = unknown> {
  id: Id;
  type: ChargebackEventType;
  entityId: Id;
  sourceSystem: string;
  externalEventId?: string;
  idempotencyKey: string;
  occurredAt: IsoDate;
  recordedAt: IsoDate;
  payload: TPayload;
}

export interface DisputeReceivedPayload {
  provider: PaymentProvider;
  providerEventType: string;
  disputeExternalId: string;
  paymentExternalId: string | null;
  transactionExternalId: string | null;
  merchantId: Id | null;
  amountMinor: number | null;
  currency: string | null;
  reasonCode: string | null;
  responseDeadline: IsoDate | null;
  rawPayload: unknown;
}

export type DisputeReceivedEvent = ChargebackSemanticEvent<DisputeReceivedPayload> & {
  type: typeof CHARGEBACK_EVENT_TYPES.disputeReceived;
};

