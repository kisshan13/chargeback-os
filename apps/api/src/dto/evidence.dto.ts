import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorEvidenceQuery, validatorEvidenceRecordParams } from "../routes/evidence/validator.js";

export const dtoEvidenceCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "EvidenceCollectionResponse" });
export const dtoEvidenceRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "EvidenceRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/evidence", request: { query: validatorEvidenceQuery }, responses: { 200: { description: "List Evidence records", content: { "application/json": { schema: dtoEvidenceCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/evidence/{recordId}", request: { params: validatorEvidenceRecordParams }, responses: { 200: { description: "View a Evidence record", content: { "application/json": { schema: dtoEvidenceRecordResponse } } }, 404: { description: "Evidence record not found" } } });
