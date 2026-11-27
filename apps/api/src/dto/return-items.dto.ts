import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorReturnItemsQuery, validatorReturnItemsRecordParams } from "../routes/return-items/validator.js";

export const dtoReturnItemsCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "ReturnItemsCollectionResponse" });
export const dtoReturnItemsRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "ReturnItemsRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/return-items", request: { query: validatorReturnItemsQuery }, responses: { 200: { description: "List Return Items records", content: { "application/json": { schema: dtoReturnItemsCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/return-items/{recordId}", request: { params: validatorReturnItemsRecordParams }, responses: { 200: { description: "View a Return Items record", content: { "application/json": { schema: dtoReturnItemsRecordResponse } } }, 404: { description: "Return Items record not found" } } });
