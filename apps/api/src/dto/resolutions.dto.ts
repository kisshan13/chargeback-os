import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorResolutionsQuery, validatorResolutionsRecordParams } from "../routes/resolutions/validator.js";

export const dtoResolutionsCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "ResolutionsCollectionResponse" });
export const dtoResolutionsRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "ResolutionsRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/resolutions", request: { query: validatorResolutionsQuery }, responses: { 200: { description: "List Resolutions records", content: { "application/json": { schema: dtoResolutionsCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/resolutions/{recordId}", request: { params: validatorResolutionsRecordParams }, responses: { 200: { description: "View a Resolutions record", content: { "application/json": { schema: dtoResolutionsRecordResponse } } }, 404: { description: "Resolutions record not found" } } });
