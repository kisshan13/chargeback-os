import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorChargebackDisputeParams, validatorChargebackDisputesQuery } from "../routes/chargebacks/validator.js";

const dtoChargebackEnvelope = (data: z.ZodTypeAny, id: string) => z.object({
  data,
  message: z.string(),
  success: z.boolean()
}).meta({ id });

export const dtoChargebackDashboardResponse = dtoChargebackEnvelope(z.object({
  isSynthetic: z.boolean(),
  generatedAt: z.string(),
  metrics: z.object({
    totalDisputes: z.number(),
    needsResponse: z.number(),
    underReview: z.number(),
    totalAtRiskMinor: z.number(),
    dueSoon: z.number()
  }),
  recentDisputes: z.array(z.unknown()),
  resourceCounts: z.record(z.string(), z.number())
}), "ChargebackDashboardResponse");

export const dtoChargebackDisputesResponse = dtoChargebackEnvelope(z.object({
  items: z.array(z.unknown()),
  total: z.number(),
  limit: z.number(),
  offset: z.number()
}), "ChargebackDisputesResponse");

export const dtoChargebackDisputeDetailResponse = dtoChargebackEnvelope(z.object({
  dispute: z.unknown(),
  reasonCode: z.unknown().nullable(),
  payment: z.unknown().nullable(),
  order: z.unknown().nullable(),
  customer: z.unknown().nullable(),
  transactions: z.array(z.unknown()),
  refunds: z.array(z.unknown()),
  disputeItems: z.array(z.unknown()),
  disputeEvents: z.array(z.unknown()),
  investigation: z.unknown()
}), "ChargebackDisputeDetailResponse");

openApiRegistry.registerPath({
  method: "get",
  path: "/api/v1/chargebacks",
  responses: { 200: { description: "Synthetic chargeback dashboard", content: { "application/json": { schema: dtoChargebackDashboardResponse } } } }
});

openApiRegistry.registerPath({
  method: "get",
  path: "/api/v1/chargebacks/disputes",
  request: { query: validatorChargebackDisputesQuery },
  responses: { 200: { description: "Synthetic chargeback disputes", content: { "application/json": { schema: dtoChargebackDisputesResponse } } } }
});

openApiRegistry.registerPath({
  method: "get",
  path: "/api/v1/chargebacks/disputes/{disputeId}",
  request: { params: validatorChargebackDisputeParams },
  responses: {
    200: { description: "Synthetic chargeback dispute detail", content: { "application/json": { schema: dtoChargebackDisputeDetailResponse } } },
    404: { description: "Dispute not found" }
  }
});
