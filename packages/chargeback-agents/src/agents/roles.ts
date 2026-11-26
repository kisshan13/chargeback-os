export const CHARGEBACK_AGENT_IDS = {
  coordinator: "chargeback.coordinator",
  financial: "chargeback.financial",
  fulfillment: "chargeback.fulfillment",
  customerPolicy: "chargeback.customer-policy",
  contradiction: "chargeback.contradiction",
  resolution: "chargeback.resolution",
} as const;

export type ChargebackAgentId =
  (typeof CHARGEBACK_AGENT_IDS)[keyof typeof CHARGEBACK_AGENT_IDS];

