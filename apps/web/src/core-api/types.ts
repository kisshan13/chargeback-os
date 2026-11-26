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
