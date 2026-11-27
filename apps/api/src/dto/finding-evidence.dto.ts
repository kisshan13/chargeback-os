import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorFindingEvidenceQuery, validatorFindingEvidenceRecordParams } from "../routes/finding-evidence/validator.js";

export const dtoFindingEvidenceCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "FindingEvidenceCollectionResponse" });
export const dtoFindingEvidenceRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "FindingEvidenceRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/finding-evidence", request: { query: validatorFindingEvidenceQuery }, responses: { 200: { description: "List Finding Evidence records", content: { "application/json": { schema: dtoFindingEvidenceCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/finding-evidence/{recordId}", request: { params: validatorFindingEvidenceRecordParams }, responses: { 200: { description: "View a Finding Evidence record", content: { "application/json": { schema: dtoFindingEvidenceRecordResponse } } }, 404: { description: "Finding Evidence record not found" } } });
