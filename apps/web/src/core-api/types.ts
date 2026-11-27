export type ExampleResponse = {
  name: string;
  message: string;
};

export type ChargebackDispute = {
  id: string;
  externalId: string;
  amountMinor: number;
  currency: string;
  customerClaim: string;
  providerStatus: string;
  createdAt: string;
  responseDeadline: string;
};

export type ChargebackDashboard = {
  isSynthetic: boolean;
  generatedAt: string;
  metrics: {
    totalDisputes: number;
    needsResponse: number;
    underReview: number;
    totalAtRiskMinor: number;
    dueSoon: number;
  };
  recentDisputes: ChargebackDispute[];
  resourceCounts: Record<string, number>;
};

export type ChargebackDisputesResponse = {
  items: ChargebackDispute[];
  total: number;
  limit: number;
  offset: number;
};

export type SyntheticRecord = Record<string, unknown> & { id: string };

export type SyntheticCollectionResponse = {
  name: string;
  items: SyntheticRecord[];
  total: number;
  limit: number;
  offset: number;
};
export type SyntheticRecordResponse = { collection: string; record: SyntheticRecord };

export type CreateDisputeInput = {
  paymentId: string;
  customerClaim: string;
  reasonCodeId?: string;
  responseDeadline?: string;
};

export type CreateDisputeResponse = {
  dispute: SyntheticRecord;
  eventId: string;
  streamUrl: string;
};

export type StartDisputeDemoRunResponse = {
  dispute: SyntheticRecord;
  eventId: string;
  eventCount: number;
  isDemo: true;
  streamUrl: string;
};

export type StartDisputeDemoRunInput = {
  paymentId?: string;
  customerClaim?: string;
  reasonCodeId?: string;
  responseDeadline?: string;
};

export type ChargebackStreamEvent = {
  id: string;
  type: string;
  disputeId: string | null;
  data: unknown;
  recordedAt?: string;
};

export type DisputeRun = {
  disputeId: string;
  status: "running" | "awaiting_approval" | "completed" | "failed" | "not_started";
  events: ChargebackStreamEvent[];
};

export type DecideDisputeApprovalInput = { decision: "approved" | "rejected"; note?: string };
export type DecideDisputeApprovalResponse = { disputeId: string; approvalId: string; decision: "approved" | "rejected" };

export type CustomerOverview = {
  customer: SyntheticRecord;
  merchant: SyntheticRecord | null;
  addresses: SyntheticRecord[];
  paymentMethods: SyntheticRecord[];
  payments: SyntheticRecord[];
  disputes: SyntheticRecord[];
  orders: Array<SyntheticRecord & {
    items: Array<SyntheticRecord & { product: SyntheticRecord | null }>;
    payments: SyntheticRecord[];
  }>;
};

export type OrderOverview = {
  order: SyntheticRecord;
  customer: SyntheticRecord | null;
  merchant: SyntheticRecord | null;
  billingAddress: SyntheticRecord | null;
  shippingAddress: SyntheticRecord | null;
  items: Array<SyntheticRecord & { product: SyntheticRecord | null }>;
  payments: SyntheticRecord[];
  shipments: Array<SyntheticRecord & {
    destination: SyntheticRecord | null;
    events: SyntheticRecord[];
    deliveryConfirmations: SyntheticRecord[];
  }>;
};

export type ProductOverview = {
  product: SyntheticRecord;
  prices: SyntheticRecord[];
  orders: Array<SyntheticRecord & { customer: SyntheticRecord | null; item: SyntheticRecord | null }>;
};

export type PaymentOverview = {
  payment: SyntheticRecord;
  customer: SyntheticRecord | null;
  paymentMethod: SyntheticRecord | null;
  order: (SyntheticRecord & { items: Array<SyntheticRecord & { product: SyntheticRecord | null }> }) | null;
  transactions: SyntheticRecord[];
  authentication: SyntheticRecord | null;
  refunds: SyntheticRecord[];
  settlements: SyntheticRecord[];
  disputes: SyntheticRecord[];
};

export type DisputeOverview = {
  dispute: SyntheticRecord;
  merchant: SyntheticRecord | null;
  reasonCode: SyntheticRecord | null;
  requirementSet: SyntheticRecord | null;
  requirements: SyntheticRecord[];
  payment: (SyntheticRecord & { transactions: SyntheticRecord[]; authentication: SyntheticRecord | null; refunds: SyntheticRecord[] }) | null;
  customer: SyntheticRecord | null;
  customerAddresses: SyntheticRecord[];
  order: (SyntheticRecord & {
    items: Array<SyntheticRecord & { product: SyntheticRecord | null }>;
    policyAcceptances: Array<{ acceptance: SyntheticRecord; version: SyntheticRecord | null; policy: SyntheticRecord | null; clauses: SyntheticRecord[] }>;
    shipments: Array<SyntheticRecord & { events: SyntheticRecord[]; confirmations: SyntheticRecord[] }>;
  }) | null;
  disputeEvents: SyntheticRecord[];
  investigationEvents: ChargebackStreamEvent[];
};

export type PolicyOverview = {
  policy: SyntheticRecord;
  merchant: SyntheticRecord | null;
  versions: Array<SyntheticRecord & {
    clauses: SyntheticRecord[];
    sourceDocument: SyntheticRecord | null;
  }>;
};
