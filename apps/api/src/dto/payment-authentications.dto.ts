import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorPaymentAuthenticationsQuery, validatorPaymentAuthenticationsRecordParams } from "../routes/payment-authentications/validator.js";

export const dtoPaymentAuthenticationsCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "PaymentAuthenticationsCollectionResponse" });
export const dtoPaymentAuthenticationsRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "PaymentAuthenticationsRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/payment-authentications", request: { query: validatorPaymentAuthenticationsQuery }, responses: { 200: { description: "List Payment Authentications records", content: { "application/json": { schema: dtoPaymentAuthenticationsCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/payment-authentications/{recordId}", request: { params: validatorPaymentAuthenticationsRecordParams }, responses: { 200: { description: "View a Payment Authentications record", content: { "application/json": { schema: dtoPaymentAuthenticationsRecordResponse } } }, 404: { description: "Payment Authentications record not found" } } });
