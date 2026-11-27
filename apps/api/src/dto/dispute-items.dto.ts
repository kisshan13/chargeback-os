import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorDisputeItemsQuery, validatorDisputeItemsRecordParams } from "../routes/dispute-items/validator.js";

export const dtoDisputeItemsCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "DisputeItemsCollectionResponse" });
export const dtoDisputeItemsRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "DisputeItemsRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/dispute-items", request: { query: validatorDisputeItemsQuery }, responses: { 200: { description: "List Dispute Items records", content: { "application/json": { schema: dtoDisputeItemsCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/dispute-items/{recordId}", request: { params: validatorDisputeItemsRecordParams }, responses: { 200: { description: "View a Dispute Items record", content: { "application/json": { schema: dtoDisputeItemsRecordResponse } } }, 404: { description: "Dispute Items record not found" } } });
