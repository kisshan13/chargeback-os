import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorPaymentMethodsQuery, validatorPaymentMethodsRecordParams } from "../routes/payment-methods/validator.js";

export const dtoPaymentMethodsCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "PaymentMethodsCollectionResponse" });
export const dtoPaymentMethodsRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "PaymentMethodsRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/payment-methods", request: { query: validatorPaymentMethodsQuery }, responses: { 200: { description: "List Payment Methods records", content: { "application/json": { schema: dtoPaymentMethodsCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/payment-methods/{recordId}", request: { params: validatorPaymentMethodsRecordParams }, responses: { 200: { description: "View a Payment Methods record", content: { "application/json": { schema: dtoPaymentMethodsRecordResponse } } }, 404: { description: "Payment Methods record not found" } } });
