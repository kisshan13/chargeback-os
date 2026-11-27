import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorResolutionFindingsQuery, validatorResolutionFindingsRecordParams } from "../routes/resolution-findings/validator.js";

export const dtoResolutionFindingsCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "ResolutionFindingsCollectionResponse" });
export const dtoResolutionFindingsRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "ResolutionFindingsRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/resolution-findings", request: { query: validatorResolutionFindingsQuery }, responses: { 200: { description: "List Resolution Findings records", content: { "application/json": { schema: dtoResolutionFindingsCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/resolution-findings/{recordId}", request: { params: validatorResolutionFindingsRecordParams }, responses: { 200: { description: "View a Resolution Findings record", content: { "application/json": { schema: dtoResolutionFindingsRecordResponse } } }, 404: { description: "Resolution Findings record not found" } } });
