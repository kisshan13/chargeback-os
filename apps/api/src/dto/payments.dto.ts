import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorPaymentsQuery, validatorPaymentsRecordParams } from "../routes/payments/validator.js";

export const dtoPaymentsCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.object({ id: z.string(), customerName: z.string(), orderReference: z.string(), refundCount: z.number(), disputeCount: z.number() }).passthrough()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "PaymentsCollectionResponse" });
export const dtoPaymentsRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "PaymentsRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/payments", request: { query: validatorPaymentsQuery }, responses: { 200: { description: "List Payments records", content: { "application/json": { schema: dtoPaymentsCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/payments/{recordId}", request: { params: validatorPaymentsRecordParams }, responses: { 200: { description: "View a Payments record", content: { "application/json": { schema: dtoPaymentsRecordResponse } } }, 404: { description: "Payments record not found" } } });

export const dtoPaymentOverviewResponse = z.object({ data: z.object({ payment: z.unknown(), customer: z.unknown().nullable(), paymentMethod: z.unknown().nullable(), order: z.unknown().nullable(), transactions: z.array(z.unknown()), authentication: z.unknown().nullable(), refunds: z.array(z.unknown()), settlements: z.array(z.unknown()), disputes: z.array(z.unknown()) }), message: z.string(), success: z.boolean() }).meta({ id: "PaymentOverviewResponse" });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/payments/{recordId}/overview", request: { params: validatorPaymentsRecordParams }, responses: { 200: { description: "Payment with customer, order, transactions, authentication, refunds, settlements, and disputes", content: { "application/json": { schema: dtoPaymentOverviewResponse } } }, 404: { description: "Payment not found" } } });
