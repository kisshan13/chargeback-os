import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorEvidenceSourceReferencesQuery, validatorEvidenceSourceReferencesRecordParams } from "../routes/evidence-source-references/validator.js";

export const dtoEvidenceSourceReferencesCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "EvidenceSourceReferencesCollectionResponse" });
export const dtoEvidenceSourceReferencesRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "EvidenceSourceReferencesRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/evidence-source-references", request: { query: validatorEvidenceSourceReferencesQuery }, responses: { 200: { description: "List Evidence Source References records", content: { "application/json": { schema: dtoEvidenceSourceReferencesCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/evidence-source-references/{recordId}", request: { params: validatorEvidenceSourceReferencesRecordParams }, responses: { 200: { description: "View a Evidence Source References record", content: { "application/json": { schema: dtoEvidenceSourceReferencesRecordResponse } } }, 404: { description: "Evidence Source References record not found" } } });
