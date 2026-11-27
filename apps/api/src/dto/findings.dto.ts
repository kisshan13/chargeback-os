import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorFindingsQuery, validatorFindingsRecordParams } from "../routes/findings/validator.js";

export const dtoFindingsCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "FindingsCollectionResponse" });
export const dtoFindingsRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "FindingsRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/findings", request: { query: validatorFindingsQuery }, responses: { 200: { description: "List Findings records", content: { "application/json": { schema: dtoFindingsCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/findings/{recordId}", request: { params: validatorFindingsRecordParams }, responses: { 200: { description: "View a Findings record", content: { "application/json": { schema: dtoFindingsRecordResponse } } }, 404: { description: "Findings record not found" } } });
