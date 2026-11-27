import type { RequestHandler } from "express";
import { createdSyntheticDisputes, findSyntheticDispute, syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorChargebackDisputeParams, validatorChargebackDisputesQuery } from "./validator.js";

const collections = {
  sourceSystems: syntheticData.sourceSystems,
  merchants: syntheticData.merchants,
  customers: syntheticData.customers,
  addresses: syntheticData.addresses,
  products: syntheticData.products,
  productPrices: syntheticData.productPrices,
  paymentMethods: syntheticData.paymentMethods,
  orders: syntheticData.orders,
  orderItems: syntheticData.orderItems,
  orderPolicyAcceptances: syntheticData.orderPolicyAcceptances,
  payments: syntheticData.payments,
  transactions: syntheticData.transactions,
  paymentAuthentications: syntheticData.paymentAuthentications,
  refunds: syntheticData.refunds,
  refundTransactions: syntheticData.refundTransactions,
  settlementEntries: syntheticData.settlementEntries,
  shipments: syntheticData.shipments,
  shipmentEvents: syntheticData.shipmentEvents,
  deliveryConfirmations: syntheticData.deliveryConfirmations,
  returns: syntheticData.returns,
  digitalFulfillmentEvents: syntheticData.digitalFulfillmentEvents,
  conversations: syntheticData.conversations,
  messages: syntheticData.messages,
  policies: syntheticData.policies,
  disputeReasonCodes: syntheticData.disputeReasonCodes,
  disputes: syntheticData.disputes,
  disputeItems: syntheticData.disputeItems,
  disputeEvents: syntheticData.disputeEvents,
  disputeRequirementSets: syntheticData.disputeRequirementSets,
  disputeRequirements: syntheticData.disputeRequirements,
  sourceDocuments: syntheticData.sourceDocuments,
  investigationRuns: syntheticData.investigationRuns,
  agentExecutions: syntheticData.agentExecutions,
  evidence: syntheticData.evidence,
  evidenceSourceReferences: syntheticData.evidenceSourceReferences,
  findings: syntheticData.findings,
  findingEvidence: syntheticData.findingEvidence,
  findingVerifications: syntheticData.findingVerifications,
  contradictions: syntheticData.contradictions,
  contradictionEvidence: syntheticData.contradictionEvidence,
  evidenceRequests: syntheticData.evidenceRequests,
  resolutions: syntheticData.resolutions,
  resolutionFindings: syntheticData.resolutionFindings,
  expectedOutcomes: syntheticData.expectedOutcomes
} as const;

export const controllerGetChargebackDashboard: RequestHandler = requestHandler(async () => {
  const allDisputes = [...syntheticData.disputes.all(), ...createdSyntheticDisputes.values()];
  const disputes = allDisputes.sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt)).slice(0, 8);
  const totalAtRiskMinor = allDisputes.reduce((total, dispute) => total + dispute.amountMinor, 0);
  const dueSoonCutoff = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const dueSoon = allDisputes.filter((dispute) => Date.parse(dispute.responseDeadline) <= dueSoonCutoff).length;

  return new ApiResponse({
    isSynthetic: true,
    generatedAt: new Date().toISOString(),
    metrics: {
      totalDisputes: allDisputes.length,
      needsResponse: allDisputes.filter((dispute) => dispute.providerStatus === "NEEDS_RESPONSE").length,
      underReview: allDisputes.filter((dispute) => dispute.providerStatus === "UNDER_REVIEW").length,
      totalAtRiskMinor,
      dueSoon
    },
    recentDisputes: disputes,
    resourceCounts: Object.fromEntries(Object.entries(collections).map(([name, collection]) => [name, name === "disputes" ? allDisputes.length : collection.length]))
  }, "Synthetic chargeback dashboard");
});

export const controllerGetChargebackDisputes: RequestHandler = requestHandler(async (req) => {
  const query = validatorChargebackDisputesQuery.parse(req.query);
  const allDisputes = [...syntheticData.disputes.all(), ...createdSyntheticDisputes.values()];
  const filtered = allDisputes.filter((dispute) => {
    const statusMatches = !query.status || dispute.providerStatus === query.status;
    const searchMatches = !query.search || [dispute.id, dispute.externalId, dispute.customerClaim]
      .join(" ")
      .toLowerCase()
      .includes(query.search.toLowerCase());
    return statusMatches && searchMatches;
  });
  const items = filtered.slice(query.offset, query.offset + query.limit);

  return new ApiResponse({ items, total: filtered.length, limit: query.limit, offset: query.offset }, "Synthetic disputes");
});

export const controllerGetChargebackDispute: RequestHandler = requestHandler(async (req) => {
  const { disputeId } = validatorChargebackDisputeParams.parse(req.params);
  const dispute = findSyntheticDispute(disputeId);
  if (!dispute) throw new ApiError(`Dispute not found: ${disputeId}`, 404);

  const payment = syntheticData.payments.findById(dispute.paymentId);
  const order = payment ? syntheticData.orders.findById(payment.orderId) : undefined;
  const investigationIds = syntheticData.investigationRuns.findMany({ where: { disputeId } }).map((run) => run.id);
  const investigationId = new Set(investigationIds);

  return new ApiResponse({
    dispute,
    reasonCode: syntheticData.disputeReasonCodes.findById(dispute.reasonCodeId) ?? null,
    payment: payment ?? null,
    order: order ?? null,
    customer: payment ? syntheticData.customers.findById(payment.customerId) ?? null : null,
    transactions: payment ? syntheticData.transactions.findMany({ where: { paymentId: payment.id } }) : [],
    refunds: payment ? syntheticData.refunds.findMany({ where: { paymentId: payment.id } }) : [],
    disputeItems: syntheticData.disputeItems.findMany({ where: { disputeId } }),
    disputeEvents: syntheticData.disputeEvents.forDispute(disputeId),
    investigation: {
      runs: syntheticData.investigationRuns.findMany({ where: { disputeId } }),
      executions: syntheticData.agentExecutions.all().filter((record) => investigationId.has(record.investigationId)),
      evidence: syntheticData.evidence.all().filter((record) => investigationId.has(record.investigationId)),
      findings: syntheticData.findings.all().filter((record) => investigationId.has(record.investigationId)),
      contradictions: syntheticData.contradictions.all().filter((record) => investigationId.has(record.investigationId)),
      evidenceRequests: syntheticData.evidenceRequests.all().filter((record) => investigationId.has(record.investigationId)),
      resolutions: syntheticData.resolutions.all().filter((record) => investigationId.has(record.investigationId))
    }
  }, "Synthetic dispute detail");
});
