export const syntheticDataGroups = [
  {
    id: "commerce",
    label: "Commerce",
    description: "Customers, orders, products, and merchant records.",
    primaryPath: "orders",
    collections: ["sourceSystems", "merchants", "customers", "addresses", "products", "productPrices", "orders", "orderItems", "orderPolicyAcceptances"]
  },
  {
    id: "payments",
    label: "Payments",
    description: "Payments, transactions, authentication, refunds, and settlements.",
    primaryPath: "payments",
    collections: ["paymentMethods", "payments", "transactions", "paymentAuthentications", "refunds", "refundTransactions", "settlementEntries"]
  },
  {
    id: "fulfillment",
    label: "Fulfillment",
    description: "Shipment, delivery, return, and digital fulfillment activity.",
    primaryPath: "shipments",
    collections: ["shipments", "shipmentItems", "shipmentEvents", "deliveryConfirmations", "returns", "returnItems", "digitalFulfillmentEvents"]
  },
  {
    id: "disputes",
    label: "Disputes",
    description: "Disputes, provider events, reason codes, and response requirements.",
    primaryPath: "disputes",
    collections: ["disputes", "disputeItems", "disputeEvents", "disputeReasonCodes", "disputeRequirementSets", "disputeRequirements"]
  },
  {
    id: "investigations",
    label: "Investigations",
    description: "Agent runs, evidence, findings, contradictions, and resolutions.",
    primaryPath: "investigation-runs",
    collections: ["investigationRuns", "agentExecutions", "evidence", "evidenceSourceReferences", "findings", "findingEvidence", "findingVerifications", "contradictions", "contradictionEvidence", "evidenceRequests", "resolutions", "resolutionFindings", "expectedOutcomes"]
  },
  {
    id: "policy",
    label: "Policy & communication",
    description: "Policies, customer conversations, messages, and source documents.",
    primaryPath: "policies",
    collections: ["conversations", "messages", "messageAttachments", "policies", "policyVersions", "policyClauses", "sourceDocuments"]
  }
] as const;

export function collectionLabel(value: string) {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/^./, (letter) => letter.toUpperCase());
}

export function collectionSlug(value: string) {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}
