import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorSourceSystemsQuery, validatorSourceSystemsRecordParams } from "../routes/source-systems/validator.js";

export const dtoSourceSystemsCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "SourceSystemsCollectionResponse" });
export const dtoSourceSystemsRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "SourceSystemsRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/source-systems", request: { query: validatorSourceSystemsQuery }, responses: { 200: { description: "List Source Systems records", content: { "application/json": { schema: dtoSourceSystemsCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/source-systems/{recordId}", request: { params: validatorSourceSystemsRecordParams }, responses: { 200: { description: "View a Source Systems record", content: { "application/json": { schema: dtoSourceSystemsRecordResponse } } }, 404: { description: "Source Systems record not found" } } });
