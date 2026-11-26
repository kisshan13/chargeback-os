import {
  CHARGEBACK_EVENT_TYPES,
  ChargebackAgentRuntime,
  ProviderEventGateway,
  createDisputeReceivedNormalizer,
  type ChargebackAgentDefinition,
  type ChargebackSemanticEvent,
} from "../index.js";

const event: ChargebackSemanticEvent = {
  id: "evt_smoke_1",
  type: CHARGEBACK_EVENT_TYPES.disputeReceived,
  entityId: "dispute_smoke_1",
  sourceSystem: "stripe",
  idempotencyKey: "stripe:evt_smoke_1",
  occurredAt: "2026-01-01T00:00:00.000Z",
  recordedAt: "2026-01-01T00:00:00.000Z",
  payload: { disputeExternalId: "dp_smoke_1" },
};

const runtime = new ChargebackAgentRuntime();

let handled = 0;
runtime.registerSituationHandler(CHARGEBACK_EVENT_TYPES.disputeReceived, () => {
  handled += 1;
});

const agent: ChargebackAgentDefinition = {
  id: "chargeback.coordinator",
  name: "Chargeback Coordinator",
  role: "coordinator",
  model: "gpt-5.5",
  instruction: "Coordinate a chargeback investigation.",
};

runtime.registerAgent(agent);
const first = await runtime.publishEvent(event);
const duplicate = await runtime.publishEvent(event);

const gateway = new ProviderEventGateway(runtime);
gateway.registerNormalizer(
  createDisputeReceivedNormalizer("stripe", (envelope) => ({
    provider: envelope.provider,
    providerEventType: envelope.providerEventType,
    disputeExternalId: "dp_smoke_2",
    paymentExternalId: null,
    transactionExternalId: null,
    merchantId: null,
    amountMinor: null,
    currency: null,
    reasonCode: null,
    responseDeadline: null,
    rawPayload: envelope.payload,
  })),
);

const normalized = await gateway.ingest({
  provider: "stripe",
  externalEventId: "evt_smoke_2",
  providerEventType: "charge.dispute.created",
  receivedAt: "2026-01-01T00:00:00.000Z",
  payload: {},
});

if (!first.accepted || !duplicate.duplicate || handled !== 2 || !normalized.accepted) {
  throw new Error("chargeback-agents smoke verification failed");
}

console.log("chargeback-agents smoke verification passed");

