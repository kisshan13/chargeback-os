import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorContradictionsQuery, validatorContradictionsRecordParams } from "../routes/contradictions/validator.js";

export const dtoContradictionsCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "ContradictionsCollectionResponse" });
export const dtoContradictionsRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "ContradictionsRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/contradictions", request: { query: validatorContradictionsQuery }, responses: { 200: { description: "List Contradictions records", content: { "application/json": { schema: dtoContradictionsCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/contradictions/{recordId}", request: { params: validatorContradictionsRecordParams }, responses: { 200: { description: "View a Contradictions record", content: { "application/json": { schema: dtoContradictionsRecordResponse } } }, 404: { description: "Contradictions record not found" } } });
