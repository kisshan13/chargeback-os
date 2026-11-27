import type { RequestHandler } from "express";
import { randomUUID } from "node:crypto";
import { CHARGEBACK_EVENT_TYPES } from "@packages/chargeback-agents";
import { getChargebackDisputeEvents, publishChargebackStreamEvent, readChargebackDemoRunTemplates, readChargebackDisputeRun } from "../../lib/chargeback-event-stream.js";
import { env } from "../../config/env.js";
import { decideStoredDisputeDemoApproval, replayStoredDisputeDemo } from "../../lib/dispute-demo-run.js";
import { createdSyntheticDisputes, decideDisputeApproval, findSyntheticDispute, publishChargebackEvent, restoreSyntheticDisputeFromRun, syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorCreateDisputeBody, validatorDisputeApprovalBody, validatorDisputeApprovalParams, validatorDisputesQuery, validatorDisputesRecordParams, validatorStartDisputeDemoRunBody } from "./validator.js";

export const controllerListDisputes: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorDisputesQuery.parse(req.query);
  const collection = syntheticData.disputes;
  const allRecords = [...collection.findMany(), ...createdSyntheticDisputes.values()]
    .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt));
  const items = allRecords.slice(offset, offset + limit).map((dispute) => {
    const payment = syntheticData.payments.findById(dispute.paymentId);
    const customer = payment ? syntheticData.customers.findById(payment.customerId) : undefined;
    const order = payment ? syntheticData.orders.findById(payment.orderId) : undefined;
    return {
      ...dispute,
      reasonName: syntheticData.disputeReasonCodes.findById(dispute.reasonCodeId)?.name ?? "Dispute reason",
      customerName: customer ? `${customer.firstName} ${customer.lastName}` : "Unknown customer",
      orderReference: order?.externalId ?? "—",
      merchantName: syntheticData.merchants.findById(dispute.merchantId)?.name ?? "Merchant",
    };
  });
  return new ApiResponse({ name: "disputes", items, total: allRecords.length, limit, offset }, "Disputes");
});

export const controllerCreateDispute: RequestHandler = requestHandler(async (req) => {
  if (!env.OPENAI_API_KEY) {
    throw new ApiError("Chargeback simulation is not configured. Set OPENAI_API_KEY in the repository root .env and restart the API.", 503);
  }
  const input = validatorCreateDisputeBody.parse(req.body);
  const payment = syntheticData.payments.findById(input.paymentId);
  if (!payment) throw new ApiError("Payment not found", 404);
  const transactions = syntheticData.transactions.findMany({ where: { paymentId: payment.id } });
  const transaction = transactions.find((item) => item.type === "CAPTURE") ?? transactions[0];
  if (!transaction) throw new ApiError("No transaction is available for this payment", 422);
  const sampleDispute = syntheticData.disputes.findMany({ limit: 1 })[0];
  const reasonCodeId = input.reasonCodeId ?? sampleDispute?.reasonCodeId;
  if (!reasonCodeId || !syntheticData.disputeReasonCodes.findById(reasonCodeId)) {
    throw new ApiError("A valid dispute reason code is required", 422);
  }
  const requirementSetId = sampleDispute?.requirementSetId;
  if (!requirementSetId) throw new ApiError("No dispute requirement set is available", 422);

  const createdAt = new Date().toISOString();
  const disputeId = `DSP-SIM-${randomUUID()}`;
  const dispute = {
    id: disputeId,
    merchantId: payment.merchantId,
    paymentId: payment.id,
    transactionId: transaction.id,
    reasonCodeId,
    requirementSetId,
    sourceSystemId: payment.sourceSystemId,
    externalId: `sim_${disputeId}`,
    customerClaim: input.customerClaim,
    amountMinor: payment.amountMinor,
    currency: payment.currency,
    providerStatus: "NEEDS_RESPONSE" as const,
    createdAt,
    responseDeadline: input.responseDeadline ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
  createdSyntheticDisputes.set(disputeId, dispute);
  const eventId = randomUUID();
  publishChargebackStreamEvent({
    id: `${disputeId}:processing-started`,
    type: "dispute.processing.started",
    disputeId,
    data: { status: "started", startedAt: createdAt, triggerEventId: eventId },
  });
  publishChargebackStreamEvent({
    id: `${eventId}:investigation-started`,
    type: CHARGEBACK_EVENT_TYPES.investigationStarted,
    disputeId,
    data: { status: "started", triggerEventId: eventId, startedAt: createdAt },
  });
  publishChargebackEvent({
    id: eventId,
    type: CHARGEBACK_EVENT_TYPES.disputeReceived,
    entityId: disputeId,
    sourceSystem: "synthetic-dashboard",
    externalEventId: dispute.externalId,
    idempotencyKey: eventId,
    occurredAt: createdAt,
    recordedAt: createdAt,
    payload: {
      provider: "stripe",
      providerEventType: "charge.dispute.created",
      disputeExternalId: dispute.externalId,
      paymentExternalId: payment.externalId,
      transactionExternalId: transaction.externalId,
      merchantId: payment.merchantId,
      amountMinor: dispute.amountMinor,
      currency: dispute.currency,
      reasonCode: syntheticData.disputeReasonCodes.findById(reasonCodeId)?.code ?? null,
      responseDeadline: dispute.responseDeadline,
      rawPayload: { dispute, simulation: true },
    },
  });
  return new ApiResponse({ dispute, eventId, streamUrl: `/api/v1/chargebacks/events/stream?disputeId=${encodeURIComponent(disputeId)}` }, "Dispute created and investigation started", 201);
});

export const controllerStartDisputeDemoRun: RequestHandler = requestHandler(async (req) => {
  const input = validatorStartDisputeDemoRunBody.parse(req.body);
  const savedRuns = await readChargebackDemoRunTemplates();
  const savedRun = savedRuns[0];
  const savedReceived = savedRun?.find((event) => event.type === CHARGEBACK_EVENT_TYPES.disputeReceived);
  const savedPayload = typeof savedReceived?.data === "object" && savedReceived.data !== null ? savedReceived.data as Record<string, unknown> : {};
  const savedRawPayload = typeof savedPayload.rawPayload === "object" && savedPayload.rawPayload !== null ? savedPayload.rawPayload as Record<string, unknown> : {};
  const savedDispute = typeof savedRawPayload.dispute === "object" && savedRawPayload.dispute !== null ? savedRawPayload.dispute as Record<string, unknown> : {};
  if (!savedRun || typeof savedDispute.paymentId !== "string") {
    throw new ApiError("No saved dispute demo runs were found in apps/api/data/dispute-runs", 503);
  }
  const paymentId = input.paymentId ?? savedDispute.paymentId;
  const payment = syntheticData.payments.findById(paymentId);
  if (!payment) throw new ApiError("Payment not found", 404);
  const transactions = syntheticData.transactions.findMany({ where: { paymentId: payment.id } });
  const transaction = transactions.find((item) => item.type === "CAPTURE") ?? transactions[0];
  if (!transaction) throw new ApiError("No transaction is available for this payment", 422);

  const reasonCodeId = input.reasonCodeId ?? (typeof savedDispute.reasonCodeId === "string" ? savedDispute.reasonCodeId : undefined);
  const reasonCode = reasonCodeId ? syntheticData.disputeReasonCodes.findById(reasonCodeId) : undefined;
  if (!reasonCode) throw new ApiError("A valid dispute reason code is required", 422);
  const requirementSet = syntheticData.disputeRequirementSets.findMany({ where: { reasonCodeId: reasonCode.id } })[0];
  if (!requirementSet) throw new ApiError("No evidence requirements are available for this dispute reason", 422);

  const createdAt = new Date().toISOString();
  const disputeId = `DSP-DEMO-${randomUUID()}`;
  const dispute = {
    id: disputeId,
    merchantId: payment.merchantId,
    paymentId: payment.id,
    transactionId: transaction.id,
    reasonCodeId: reasonCode.id,
    requirementSetId: requirementSet.id,
    sourceSystemId: payment.sourceSystemId,
    externalId: `demo_${disputeId}`,
    customerClaim: input.customerClaim ?? String(savedDispute.customerClaim ?? "I do not recognize this payment."),
    amountMinor: payment.amountMinor,
    currency: payment.currency,
    providerStatus: "NEEDS_RESPONSE" as const,
    createdAt,
    responseDeadline: input.responseDeadline ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
  createdSyntheticDisputes.set(disputeId, dispute);

  const eventCount = await replayStoredDisputeDemo({
    dispute,
    payment,
    transaction,
    reasonCode,
    customer: syntheticData.customers.findById(payment.customerId),
    order: syntheticData.orders.findById(payment.orderId),
    merchant: syntheticData.merchants.findById(payment.merchantId),
  });
  if (eventCount === null) {
    createdSyntheticDisputes.delete(disputeId);
    throw new ApiError("No saved dispute demo runs were found in apps/api/data/dispute-runs", 503);
  }
  return new ApiResponse({
    dispute,
    eventId: `${disputeId}:demo:0`,
    eventCount,
    isDemo: true,
    streamUrl: `/api/v1/chargebacks/events/stream?disputeId=${encodeURIComponent(disputeId)}`,
  }, "Demo dispute investigation started", 201);
});

export const controllerGetDisputesRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorDisputesRecordParams.parse(req.params);
  const record = await restoreSyntheticDisputeFromRun(recordId);
  if (!record) throw new ApiError("Disputes record not found", 404);
  return new ApiResponse({ collection: "disputes", record }, "Synthetic Disputes record");
});

export const controllerGetDisputeRun: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorDisputesRecordParams.parse(req.params);
  const events = await readChargebackDisputeRun(recordId);
  if (!findSyntheticDispute(recordId) && events.length === 0) throw new ApiError("Dispute not found", 404);
  const latestProcessingEvent = [...events].reverse().find((event) => event.type.startsWith("dispute.processing."));
  const decidedApprovalIds = new Set(events.filter((event) => event.type === "dispute.approval.decided").map((event) => {
    const data = typeof event.data === "object" && event.data !== null ? event.data as Record<string, unknown> : {};
    return data.approvalId;
  }));
  const hasPendingApproval = events.some((event) => {
    if (event.type !== "dispute.approval.required") return false;
    const data = typeof event.data === "object" && event.data !== null ? event.data as Record<string, unknown> : {};
    return typeof data.approvalId === "string" && !decidedApprovalIds.has(data.approvalId);
  });
  const status = latestProcessingEvent?.type === "dispute.processing.ended"
    ? "completed"
    : latestProcessingEvent?.type === "dispute.processing.failed" ? "failed"
    : hasPendingApproval ? "awaiting_approval"
      : latestProcessingEvent?.type === "dispute.processing.started" ? "running" : "not_started";
  return new ApiResponse({ disputeId: recordId, status, events }, "Dispute simulation run");
});

export const controllerDecideDisputeApproval: RequestHandler = requestHandler(async (req) => {
  const { recordId, approvalId } = validatorDisputeApprovalParams.parse(req.params);
  const { decision, note } = validatorDisputeApprovalBody.parse(req.body);
  if (!decideDisputeApproval(recordId, approvalId, decision, note) && !decideStoredDisputeDemoApproval(recordId, approvalId, decision, note)) {
    throw new ApiError("This approval is no longer pending", 409);
  }
  return new ApiResponse({ disputeId: recordId, approvalId, decision }, "Approval decision recorded");
});

export const controllerGetDisputeOverview: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorDisputesRecordParams.parse(req.params);
  const dispute = await restoreSyntheticDisputeFromRun(recordId);
  if (!dispute) throw new ApiError("Dispute not found", 404);
  const payment = syntheticData.payments.findById(dispute.paymentId);
  const order = payment ? syntheticData.orders.findById(payment.orderId) : undefined;
  const reasonCode = syntheticData.disputeReasonCodes.findById(dispute.reasonCodeId) ?? null;
  const requirementSet = syntheticData.disputeRequirementSets.findById(dispute.requirementSetId) ?? null;
  const requirements = requirementSet
    ? syntheticData.disputeRequirements.findMany({ where: { requirementSetId: requirementSet.id } })
    : [];
  const policyAcceptances = order
    ? syntheticData.orderPolicyAcceptances.findMany({ where: { orderId: order.id } }).map((acceptance) => {
      const version = syntheticData.policyVersions.findById(acceptance.policyVersionId);
      const policy = version ? syntheticData.policies.findById(version.policyId) : undefined;
      return {
        acceptance,
        version: version ?? null,
        policy: policy ?? null,
        clauses: version ? syntheticData.policyClauses.findMany({ where: { policyVersionId: version.id } }) : [],
      };
    })
    : [];
  const shipments = order ? syntheticData.shipments.findMany({ where: { orderId: order.id } }) : [];

  return new ApiResponse({
    dispute,
    merchant: syntheticData.merchants.findById(dispute.merchantId) ?? null,
    reasonCode,
    requirementSet,
    requirements,
    payment: payment ? {
      ...payment,
      transactions: syntheticData.transactions.findMany({ where: { paymentId: payment.id } }),
      authentication: syntheticData.paymentAuthentications.findFirst({ where: { paymentId: payment.id } }) ?? null,
      refunds: syntheticData.refunds.findMany({ where: { paymentId: payment.id } }),
    } : null,
    customer: payment ? syntheticData.customers.findById(payment.customerId) ?? null : null,
    customerAddresses: payment ? syntheticData.addresses.findMany({ where: { customerId: payment.customerId } }) : [],
    order: order ? {
      ...order,
      items: syntheticData.orderItems.findMany({ where: { orderId: order.id } }).map((item) => ({
        ...item,
        product: syntheticData.products.findById(item.productId) ?? null,
      })),
      policyAcceptances,
      shipments: shipments.map((shipment) => ({
        ...shipment,
        events: syntheticData.shipmentEvents.findMany({ where: { shipmentId: shipment.id }, orderBy: { field: "occurredAt", direction: "desc" } }),
        confirmations: syntheticData.deliveryConfirmations.findMany({ where: { shipmentId: shipment.id } }),
      })),
    } : null,
    disputeEvents: syntheticData.disputeEvents.forDispute(recordId),
    investigationEvents: getChargebackDisputeEvents(recordId),
  }, "Dispute case overview");
});
