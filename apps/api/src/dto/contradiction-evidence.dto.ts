import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorContradictionEvidenceQuery, validatorContradictionEvidenceRecordParams } from "../routes/contradiction-evidence/validator.js";

export const dtoContradictionEvidenceCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "ContradictionEvidenceCollectionResponse" });
export const dtoContradictionEvidenceRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "ContradictionEvidenceRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/contradiction-evidence", request: { query: validatorContradictionEvidenceQuery }, responses: { 200: { description: "List Contradiction Evidence records", content: { "application/json": { schema: dtoContradictionEvidenceCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/contradiction-evidence/{recordId}", request: { params: validatorContradictionEvidenceRecordParams }, responses: { 200: { description: "View a Contradiction Evidence record", content: { "application/json": { schema: dtoContradictionEvidenceRecordResponse } } }, 404: { description: "Contradiction Evidence record not found" } } });
