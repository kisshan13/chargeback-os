import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorDeliveryConfirmationsQuery, validatorDeliveryConfirmationsRecordParams } from "../routes/delivery-confirmations/validator.js";

export const dtoDeliveryConfirmationsCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "DeliveryConfirmationsCollectionResponse" });
export const dtoDeliveryConfirmationsRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "DeliveryConfirmationsRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/delivery-confirmations", request: { query: validatorDeliveryConfirmationsQuery }, responses: { 200: { description: "List Delivery Confirmations records", content: { "application/json": { schema: dtoDeliveryConfirmationsCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/delivery-confirmations/{recordId}", request: { params: validatorDeliveryConfirmationsRecordParams }, responses: { 200: { description: "View a Delivery Confirmations record", content: { "application/json": { schema: dtoDeliveryConfirmationsRecordResponse } } }, 404: { description: "Delivery Confirmations record not found" } } });
