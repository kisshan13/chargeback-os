import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorMerchantsQuery, validatorMerchantsRecordParams } from "../routes/merchants/validator.js";

export const dtoMerchantsCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "MerchantsCollectionResponse" });
export const dtoMerchantsRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "MerchantsRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/merchants", request: { query: validatorMerchantsQuery }, responses: { 200: { description: "List Merchants records", content: { "application/json": { schema: dtoMerchantsCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/merchants/{recordId}", request: { params: validatorMerchantsRecordParams }, responses: { 200: { description: "View a Merchants record", content: { "application/json": { schema: dtoMerchantsRecordResponse } } }, 404: { description: "Merchants record not found" } } });
