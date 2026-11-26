import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import {
  OpenAIChatCompletions,
  supportedModels,
} from "@mozaik-ai/core";
import {
  CHARGEBACK_AGENT_IDS,
  CHARGEBACK_EVENT_TYPES,
  ChargebackAgentRuntime,
  createChargebackToolCatalog,
  type ChargebackSemanticEvent,
} from "@packages/chargeback-agents";
import { SyntheticDataStore } from "@packages/synthetic-data";
import { env } from "../config/env.js";
import {
  publishChargebackStreamEvent,
} from "./chargeback-event-stream.js";

const syntheticDataDirectory = env.SYNTHETIC_DATA_DIR
  ? resolve(process.cwd(), env.SYNTHETIC_DATA_DIR)
  : resolve(
      fileURLToPath(new URL("../../../../packages/synthetic-data/data", import.meta.url)),
    );

export const syntheticData = SyntheticDataStore.fromDataDirectory(syntheticDataDirectory);

const referenceModel =
  supportedModels.find((model) => model.specification.name === "gpt-5.5") ??
  supportedModels[0];

if (!referenceModel) {
  throw new Error("Mozaik does not provide a reference model specification");
}

const chargebackModel = {
  ...referenceModel,
  endpoint: new OpenAIChatCompletions(undefined, {
    apiKey: env.OPENAI_API_KEY,
    baseURL: env.OPENAI_BASE_URL,
  }),
  specification: {
    ...referenceModel.specification,
    name: env.MOZAIK_MODEL,
    provider: "openai-compatible",
  },
};

const investigationRecords = {
  evidence: [] as Array<Record<string, unknown>>,
  findings: [] as Array<Record<string, unknown>>,
  resolutions: [] as Array<Record<string, unknown>>,
};

const toolPorts = {
  loadDispute: async (input: unknown) => getDispute(input),
  loadOrder: async (input: unknown) => {
    const record = toRecord(input);
    const orderId = stringValue(record.orderId);
    if (orderId) return syntheticData.orders.requireById(orderId);

    const dispute = getDispute(input);
    const payment = syntheticData.payments.requireById(dispute.paymentId);
    return syntheticData.orders.requireById(payment.orderId);
  },
  loadPayment: async (input: unknown) => {
    const record = toRecord(input);
    const paymentId = stringValue(record.paymentId);
    return syntheticData.payments.requireById(paymentId ?? getDispute(input).paymentId);
  },
  loadFulfillment: async (input: unknown) => {
    const record = toRecord(input);
    const orderId = stringValue(record.orderId) ?? syntheticData.payments.requireById(
      getDispute(input).paymentId,
    ).orderId;
    return {
      shipments: syntheticData.shipments.forOrder(orderId),
      shipmentEvents: syntheticData.shipmentEvents.findMany({ where: { shipmentId: { in: syntheticData.shipments.forOrder(orderId).map((shipment) => shipment.id) } } }),
    };
  },
  loadCustomerCommunications: async (input: unknown) => {
    const dispute = getDispute(input);
    const payment = syntheticData.payments.requireById(dispute.paymentId);
    return syntheticData.conversations.findMany({ where: { customerId: payment.customerId } });
  },
  saveEvidence: async (input: unknown) => recordInvestigation("evidence", input, "chargeback.evidence.collected"),
  createFinding: async (input: unknown) => recordInvestigation("findings", input, "chargeback.finding.created"),
  createEvidenceRequest: async (input: unknown) => recordInvestigation("evidence", input, "chargeback.evidence.requested"),
  proposeResolution: async (input: unknown) => recordInvestigation("resolutions", input, CHARGEBACK_EVENT_TYPES.resolutionProposed),
  submitProviderResponse: async (input: unknown) => ({
    status: "approval_required",
    message: "Provider submission is not connected yet. Approval is required before the external side effect.",
    input,
  }),
};

const chargebackTools = createChargebackToolCatalog(toolPorts);

export const chargebackRuntime = new ChargebackAgentRuntime({
  inferenceRunnerConfig: {
    supportedModels: [chargebackModel],
  },
  onEvent: (event) => {
    publishChargebackStreamEvent({
      id: event.id,
      type: event.type,
      disputeId: event.entityId,
      data: event.payload,
    });
  },
});

chargebackRuntime.registerAgent({
  id: CHARGEBACK_AGENT_IDS.coordinator,
  name: "Chargeback Coordinator",
  role: "coordinator",
  model: env.MOZAIK_MODEL,
  instruction: "Coordinate chargeback investigations. Read facts with tools, delegate specialist work through events, and never submit a provider response without approval.",
  tools: chargebackTools,
});

chargebackRuntime.registerAgent({
  id: CHARGEBACK_AGENT_IDS.financial,
  name: "Financial Evidence Agent",
  role: "financial",
  model: env.MOZAIK_MODEL,
  instruction: "Analyze payment, transaction, refund, authentication, and settlement facts. Return evidence-backed findings.",
  tools: chargebackTools,
});

chargebackRuntime.registerAgent({
  id: CHARGEBACK_AGENT_IDS.fulfillment,
  name: "Fulfillment Evidence Agent",
  role: "fulfillment",
  model: env.MOZAIK_MODEL,
  instruction: "Analyze shipment, delivery, return, and digital fulfillment facts. Return evidence-backed findings.",
  tools: chargebackTools,
});

chargebackRuntime.registerAgent({
  id: CHARGEBACK_AGENT_IDS.customerPolicy,
  name: "Customer Policy Agent",
  role: "customer-policy",
  model: env.MOZAIK_MODEL,
  instruction: "Analyze customer communications, accepted policies, and relevant support history.",
  tools: chargebackTools,
});

chargebackRuntime.registerAgent({
  id: CHARGEBACK_AGENT_IDS.contradiction,
  name: "Contradiction Agent",
  role: "contradiction",
  model: env.MOZAIK_MODEL,
  instruction: "Compare findings and evidence. Identify contradictions, missing evidence, and confidence risks.",
  tools: chargebackTools,
});

chargebackRuntime.registerAgent({
  id: CHARGEBACK_AGENT_IDS.resolution,
  name: "Resolution Agent",
  role: "resolution",
  model: env.MOZAIK_MODEL,
  instruction: "Propose a provider response from verified findings. Never perform the final provider submission without approval.",
  tools: chargebackTools,
});

chargebackRuntime.registerSituationHandler(
  CHARGEBACK_EVENT_TYPES.disputeReceived,
  ({ event }) => {
    chargebackRuntime.runAgent(CHARGEBACK_AGENT_IDS.coordinator, event);
  },
);

export function publishChargebackEvent(event: ChargebackSemanticEvent): void {
  chargebackRuntime.publishEvent(event);
}

function getDispute(input: unknown) {
  const record = toRecord(input);
  const disputeId = stringValue(record.disputeId) ?? stringValue(record.id);
  if (!disputeId) {
    throw new Error("A disputeId is required for synthetic-data investigation tools");
  }
  return syntheticData.disputes.requireById(disputeId);
}

function recordInvestigation(
  collection: keyof typeof investigationRecords,
  input: unknown,
  eventType: string,
): Record<string, unknown> {
  const record: Record<string, unknown> = {
    ...toRecord(input),
    createdAt: new Date().toISOString(),
  };
  investigationRecords[collection].push(record);
  const disputeId = stringValue(record.disputeId);
  if (disputeId) {
    publishChargebackStreamEvent({
      id: `${eventType}:${disputeId}:${investigationRecords[collection].length}`,
      type: eventType,
      disputeId,
      data: record,
    });
  }
  return record;
}

function toRecord(input: unknown): Record<string, unknown> {
  return typeof input === "object" && input !== null
    ? (input as Record<string, unknown>)
    : {};
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}
