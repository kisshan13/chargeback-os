import { AsyncLocalStorage } from "node:async_hooks";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
import {
  FunctionCallItem,
  OpenAIChatCompletions,
  supportedModels,
  type InterceptionHandler,
  type SemanticEvent as MozaikSemanticEvent,
} from "@mozaik-ai/core";
import {
  CHARGEBACK_AGENT_IDS,
  CHARGEBACK_EVENT_TYPES,
  CHARGEBACK_TOOL_NAMES,
  ChargebackAgentRuntime,
  createChargebackToolCatalog,
  type ChargebackSemanticEvent,
} from "@packages/chargeback-agents";
import { SyntheticDataStore } from "@packages/synthetic-data";
import type { Dispute } from "@packages/synthetic-data";
import { env } from "../config/env.js";
import logger from "./pino.js";
import {
  readChargebackDisputeRun,
  publishChargebackStreamEvent,
} from "./chargeback-event-stream.js";

const syntheticDataDirectory = env.SYNTHETIC_DATA_DIR
  ? resolve(process.cwd(), env.SYNTHETIC_DATA_DIR)
  : resolve(
      fileURLToPath(new URL("../../../../packages/synthetic-data/data", import.meta.url)),
    );

export const syntheticData = SyntheticDataStore.fromDataDirectory(syntheticDataDirectory);
export const createdSyntheticDisputes = new Map<string, Dispute>();

export function findSyntheticDispute(disputeId: string): Dispute | undefined {
  return createdSyntheticDisputes.get(disputeId) ?? syntheticData.disputes.findById(disputeId);
}

export async function restoreSyntheticDisputeFromRun(disputeId: string): Promise<Dispute | undefined> {
  const existing = findSyntheticDispute(disputeId);
  if (existing) return existing;
  const events = await readChargebackDisputeRun(disputeId);
  const received = events.find((event) => event.type === CHARGEBACK_EVENT_TYPES.disputeReceived);
  const payload = toRecord(received?.data);
  const rawPayload = toRecord(payload.rawPayload);
  const dispute = toRecord(rawPayload.dispute);
  if (dispute.id !== disputeId) return undefined;
  const restored = dispute as unknown as Dispute;
  createdSyntheticDisputes.set(disputeId, restored);
  return restored;
}

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

const agentNames = new Map<string, string>([
  [CHARGEBACK_AGENT_IDS.coordinator, "Chargeback Coordinator"],
  [CHARGEBACK_AGENT_IDS.financial, "Financial Evidence Agent"],
  [CHARGEBACK_AGENT_IDS.fulfillment, "Fulfillment Evidence Agent"],
  [CHARGEBACK_AGENT_IDS.customerPolicy, "Customer Policy Agent"],
  [CHARGEBACK_AGENT_IDS.contradiction, "Contradiction Agent"],
  [CHARGEBACK_AGENT_IDS.resolution, "Resolution Agent"],
]);
const disputeByLoop = new Map<string, string>();
const loopSteps = new Map<string, { inference: number; activeInference?: string }>();
const activeParticipantByDispute = new Map<string, { id: string; name: string }>();
const stepStartedAt = new Map<string, string>();
const participantStartedAt = new Map<string, string>();

type ApprovalDecision = "approved" | "rejected";
type PendingDisputeApproval = {
  id: string;
  disputeId: string;
  requestedAt: string;
  data: Record<string, unknown>;
  resolve: (decision: { decision: ApprovalDecision; note?: string; decidedAt: string }) => void;
};
const pendingDisputeApprovals = new Map<string, PendingDisputeApproval>();
type AgentLoopContext = {
  disputeId: string;
  participantId: string;
  participantName: string;
  loopId?: string;
};
const agentLoopContext = new AsyncLocalStorage<AgentLoopContext>();
const failedAgentLoops = new Set<string>();

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
    status: toRecord(input).approvalDecision === "approved" ? "approved" : "rejected",
    message: toRecord(input).approvalDecision === "approved"
      ? "A human reviewer approved this response. Provider submission remains simulated because no provider connector is configured."
      : "A human reviewer rejected this response. No provider submission was made.",
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
  onRuntimeEvent: (event) => publishAgentLifecycleEvent(event),
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
    const context: AgentLoopContext = {
      disputeId: event.entityId,
      participantId: CHARGEBACK_AGENT_IDS.coordinator,
      participantName: agentNames.get(CHARGEBACK_AGENT_IDS.coordinator) ?? "Chargeback Coordinator",
    };
    try {
      agentLoopContext.run(context, () => chargebackRuntime.runAgent(CHARGEBACK_AGENT_IDS.coordinator, event, {
        interceptionHandler: createDisputeApprovalInterception(event.entityId, CHARGEBACK_AGENT_IDS.coordinator),
      }));
    } catch (error) {
      reportAgentLoopFailure(context, error);
    }
  },
);

process.on("unhandledRejection", (reason: unknown) => {
  const context = agentLoopContext.getStore();
  if (context) {
    reportAgentLoopFailure(context, reason);
    return;
  }

  logger.fatal({ err: asError(reason) }, "Unhandled promise rejection outside a dispute agent loop");
  setImmediate(() => { throw asError(reason); });
});

export function decideDisputeApproval(
  disputeId: string,
  approvalId: string,
  decision: ApprovalDecision,
  note?: string,
): boolean {
  const approval = pendingDisputeApprovals.get(approvalId);
  if (!approval || approval.disputeId !== disputeId) return false;
  const decidedAt = new Date().toISOString();
  publishChargebackStreamEvent({
    id: `${approval.id}:decided`,
    type: "dispute.approval.decided",
    disputeId,
    data: { ...approval.data, approvalId, decision, note, requestedAt: approval.requestedAt, decidedAt },
  });
  pendingDisputeApprovals.delete(approvalId);
  approval.resolve({ decision, note, decidedAt });
  return true;
}

export function publishChargebackEvent(event: ChargebackSemanticEvent): void {
  chargebackRuntime.publishEvent(event);
}

function getDispute(input: unknown) {
  const record = toRecord(input);
  const disputeId = stringValue(record.disputeId) ?? stringValue(record.id);
  if (!disputeId) {
    throw new Error("A disputeId is required for synthetic-data investigation tools");
  }
  const dispute = findSyntheticDispute(disputeId);
  if (!dispute) throw new Error(`Dispute not found: ${disputeId}`);
  return dispute;
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
  const disputeId = stringValue(record.disputeId);
  const participant = disputeId ? activeParticipantByDispute.get(disputeId) : undefined;
  if (participant) {
    record.agentId = participant.id;
    record.agentName = participant.name;
  }
  investigationRecords[collection].push(record);
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

function publishAgentLifecycleEvent(event: MozaikSemanticEvent): void {
  const payload = toRecord(event.payload);
  const loopId = stringValue(payload.loopId);
  const agentId = event.producerId;
  const agentName = agentNames.get(agentId) ?? agentId;
  const now = event.occurredAt.toISOString();

  if (event.type === "message_received.started") {
    const content = stringValue(payload.content) ?? "";
    const disputeId = content.match(/dispute entity ([^\.\s]+)/i)?.[1];
    if (!loopId || !disputeId) return;
    const currentContext = agentLoopContext.getStore();
    if (currentContext?.disputeId === disputeId) currentContext.loopId = loopId;
    disputeByLoop.set(loopId, disputeId);
    loopSteps.set(loopId, { inference: 0 });
    activeParticipantByDispute.set(disputeId, { id: agentId, name: agentName });
    participantStartedAt.set(loopId, now);
    publishStep(disputeId, `${loopId}:participant`, "dispute.participant.active", {
      stepId: `${loopId}:participant`, stepName: "Agent investigation", status: "active",
      participantId: agentId, participantName: agentName, loopId, startedAt: now,
      input: content,
    });
    return;
  }

  if (!loopId) return;
  const disputeId = disputeByLoop.get(loopId);
  if (!disputeId) return;
  const state = loopSteps.get(loopId) ?? { inference: 0 };
  const call = toRecord(payload.call);

  if (event.type === "inference.started") {
    const stepId = `${loopId}:inference:${++state.inference}`;
    state.activeInference = stepId;
    stepStartedAt.set(stepId, now);
    publishStep(disputeId, stepId, "dispute.step.started", {
      stepId, stepName: "Reviewing case information", status: "started",
      participantId: agentId, participantName: agentName, loopId, startedAt: now,
      model: stringValue(toRecord(payload.input).model),
    });
  } else if (event.type === "inference.completed") {
    const stepId = state.activeInference ?? `${loopId}:inference:${state.inference}`;
    const startedAt = stepStartedAt.get(stepId);
    publishStep(disputeId, stepId, "dispute.step.completed", {
      stepId, stepName: "Reviewing case information", status: "completed",
      participantId: agentId, participantName: agentName, loopId, endedAt: now,
      ...(startedAt ? { startedAt, durationMs: Math.max(0, Date.parse(now) - Date.parse(startedAt)) } : {}),
      result: summarizeInference(payload),
    });
    stepStartedAt.delete(stepId);
    delete state.activeInference;
  } else if (event.type === "function_call.started" || event.type === "function_call.completed") {
    const callId = stringValue(call.callId) ?? stringValue(payload.callId) ?? `tool-${state.inference}`;
    const stepId = `${loopId}:tool:${callId}`;
    const toolName = stringValue(call.name) ?? "Investigation tool";
    const started = event.type.endsWith("started");
    if (started) stepStartedAt.set(stepId, now);
    const startedAt = stepStartedAt.get(stepId);
    publishStep(disputeId, stepId, started ? "dispute.step.started" : "dispute.step.completed", {
      stepId, stepName: humanizeToolName(toolName), status: started ? "started" : "completed",
      participantId: agentId, participantName: agentName, loopId,
      ...(started ? { startedAt: now, input: summarizeToolInput(call) } : { endedAt: now, ...(startedAt ? { startedAt, durationMs: Math.max(0, Date.parse(now) - Date.parse(startedAt)) } : {}), result: summarizeToolResult(payload) }),
    });
    if (!started) stepStartedAt.delete(stepId);
  } else if (event.type === "model.answer") {
    const startedAt = participantStartedAt.get(loopId);
    const answer = toRecord(payload.answer);
    const message = textValue(answer.content);
    if (message) {
      publishStep(disputeId, `${loopId}:message`, "dispute.participant.message", {
        stepId: `${loopId}:message`, stepName: "Participant message", status: "message",
        participantId: agentId, participantName: agentName, loopId, producedAt: now,
        message,
      });
    }
    publishStep(disputeId, `${loopId}:participant`, "dispute.participant.inactive", {
      stepId: `${loopId}:participant`, stepName: "Agent investigation", status: "inactive",
      participantId: agentId, participantName: agentName, loopId, endedAt: now,
      ...(startedAt ? { startedAt, durationMs: Math.max(0, Date.parse(now) - Date.parse(startedAt)) } : {}),
    });
    publishChargebackStreamEvent({
      id: `${disputeId}:processing-ended:${loopId}`,
      type: "dispute.processing.ended",
      disputeId,
      data: { status: "completed", endedAt: now, participantId: agentId, participantName: agentName, loopId },
    });
    disputeByLoop.delete(loopId);
    loopSteps.delete(loopId);
    participantStartedAt.delete(loopId);
    activeParticipantByDispute.delete(disputeId);
  }
}

function reportAgentLoopFailure(context: AgentLoopContext, error: unknown): void {
  const loopKey = `${context.disputeId}:${context.loopId ?? context.participantId}`;
  if (failedAgentLoops.has(loopKey)) return;
  failedAgentLoops.add(loopKey);

  const failedAt = new Date().toISOString();
  const message = "The investigation stopped because an agent encountered an error. The case data is saved; check the API logs before retrying.";
  logger.error({ err: asError(error), disputeId: context.disputeId, participantId: context.participantId }, "Dispute agent loop failed");

  try {
    if (context.loopId) {
      publishChargebackStreamEvent({
        id: `${context.disputeId}:participant-failed:${context.loopId}`,
        type: "dispute.participant.inactive",
        disputeId: context.disputeId,
        recordedAt: failedAt,
        data: {
          stepId: `${context.loopId}:participant`,
          stepName: "Agent investigation",
          status: "failed",
          participantId: context.participantId,
          participantName: context.participantName,
          loopId: context.loopId,
          endedAt: failedAt,
          message,
        },
      });
    }

    publishChargebackStreamEvent({
      id: `${context.disputeId}:processing-failed:${context.loopId ?? randomUUID()}`,
      type: "dispute.processing.failed",
      disputeId: context.disputeId,
      recordedAt: failedAt,
      data: {
        status: "failed",
        failedAt,
        participantId: context.participantId,
        participantName: context.participantName,
        loopId: context.loopId,
        message,
      },
    });
  } catch (publishError) {
    logger.error({ err: asError(publishError), disputeId: context.disputeId }, "Could not publish dispute agent failure to the frontend");
  }

  if (context.loopId) {
    disputeByLoop.delete(context.loopId);
    loopSteps.delete(context.loopId);
    participantStartedAt.delete(context.loopId);
    if (activeParticipantByDispute.get(context.disputeId)?.id === context.participantId) {
      activeParticipantByDispute.delete(context.disputeId);
    }
  }
}

function asError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

function createDisputeApprovalInterception(disputeId: string, participantId: string): InterceptionHandler {
  return {
    isSatisfiedBy(transition) {
      return transition.nextStateId === "function_call"
        && transition.input.call.name === CHARGEBACK_TOOL_NAMES.submitProviderResponse;
    },
    async handle(transition) {
      if (transition.nextStateId !== "function_call") return transition;
      const { call } = transition.input;
      const approvalId = randomUUID();
      const requestedAt = new Date().toISOString();
      const data = {
        approvalId,
        toolName: call.name,
        participantId,
        participantName: agentNames.get(participantId) ?? participantId,
        proposedResponse: parseJson(call.args),
        caseContext: getApprovalCaseContext(disputeId),
        evidence: investigationRecords.evidence.filter((record) => record.disputeId === disputeId),
        findings: investigationRecords.findings.filter((record) => record.disputeId === disputeId),
        resolutions: investigationRecords.resolutions.filter((record) => record.disputeId === disputeId),
      };
      publishChargebackStreamEvent({
        id: `${approvalId}:required`,
        type: "dispute.approval.required",
        disputeId,
        data: { ...data, status: "pending", requestedAt },
      });
      const decision = await new Promise<{ decision: ApprovalDecision; note?: string; decidedAt: string }>((resolve) => {
        pendingDisputeApprovals.set(approvalId, { id: approvalId, disputeId, requestedAt, data, resolve });
      });
      const updatedArgs = {
        ...toRecord(parseJson(call.args)),
        approvalDecision: decision.decision,
        approvalNote: decision.note,
        approvalDecidedAt: decision.decidedAt,
      };
      return {
        ...transition,
        input: {
          ...transition.input,
          call: FunctionCallItem.rehydrate({
            callId: call.callId,
            name: call.name,
            args: JSON.stringify(updatedArgs),
          }),
        },
      };
    },
  };
}

function getApprovalCaseContext(disputeId: string): Record<string, unknown> {
  const dispute = findSyntheticDispute(disputeId);
  if (!dispute) return {};
  const payment = syntheticData.payments.findById(dispute.paymentId);
  const order = payment ? syntheticData.orders.findById(payment.orderId) : undefined;
  const customer = payment ? syntheticData.customers.findById(payment.customerId) : undefined;
  return {
    dispute,
    customer: customer ?? null,
    payment: payment ? {
      ...payment,
      transactions: syntheticData.transactions.findMany({ where: { paymentId: payment.id } }),
      authentication: syntheticData.paymentAuthentications.findFirst({ where: { paymentId: payment.id } }) ?? null,
      refunds: syntheticData.refunds.findMany({ where: { paymentId: payment.id } }),
    } : null,
    order: order ? {
      ...order,
      items: syntheticData.orderItems.findMany({ where: { orderId: order.id } }).map((item) => ({
        ...item,
        product: syntheticData.products.findById(item.productId) ?? null,
      })),
      shipments: syntheticData.shipments.findMany({ where: { orderId: order.id } }),
      policyAcceptances: syntheticData.orderPolicyAcceptances.findMany({ where: { orderId: order.id } }).map((acceptance) => ({
        acceptance,
        version: syntheticData.policyVersions.findById(acceptance.policyVersionId) ?? null,
      })),
    } : null,
  };
}

function parseJson(value: string): unknown {
  try { return JSON.parse(value) as unknown; } catch { return { raw: value }; }
}

function publishStep(disputeId: string, id: string, type: string, data: Record<string, unknown>) {
  publishChargebackStreamEvent({
    id: `${id}:${type.endsWith("started") ? "started" : type.endsWith("completed") ? "completed" : "event"}`,
    type,
    disputeId,
    data,
  });
}

function summarizeToolInput(call: Record<string, unknown>): unknown {
  const raw = typeof call.arguments === "string" ? call.arguments : undefined;
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(raw) as unknown;
    const record = toRecord(parsed);
    return Object.fromEntries(Object.entries(record).filter(([key]) => !/secret|token|authorization/i.test(key)));
  } catch {
    return raw;
  }
}

function summarizeToolResult(payload: Record<string, unknown>): unknown {
  const output = textValue(payload.output);
  if (output) return output;
  const record = toRecord(payload.output);
  return Object.keys(record).length ? record : undefined;
}

function summarizeInference(payload: Record<string, unknown>): unknown {
  const output = toRecord(payload);
  const items = Array.isArray(output.items) ? output.items.map((item) => {
    const record = toRecord(item);
    return {
      type: stringValue(record.type) ?? "result",
      ...(textValue(record.content) ? { content: textValue(record.content) } : {}),
      ...(typeof record.name === "string" ? { name: record.name } : {}),
    };
  }) : undefined;
  return {
    ...(typeof output.finishReason === "string" ? { finishReason: output.finishReason } : {}),
    ...(typeof output.content === "string" ? { summary: output.content } : {}),
    ...(items?.length ? { items } : {}),
    ...(output.tokenUsage !== undefined ? { tokenUsage: output.tokenUsage } : {}),
  };
}

function textValue(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  const record = toRecord(value);
  return typeof record.text === "string" ? record.text : undefined;
}

function humanizeToolName(name: string): string {
  return name.replace(/[_-]/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (letter) => letter.toUpperCase());
}

function toRecord(input: unknown): Record<string, unknown> {
  return typeof input === "object" && input !== null
    ? (input as Record<string, unknown>)
    : {};
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}
