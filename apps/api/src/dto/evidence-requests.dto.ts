import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorEvidenceRequestsQuery, validatorEvidenceRequestsRecordParams } from "../routes/evidence-requests/validator.js";

export const dtoEvidenceRequestsCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "EvidenceRequestsCollectionResponse" });
export const dtoEvidenceRequestsRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "EvidenceRequestsRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/evidence-requests", request: { query: validatorEvidenceRequestsQuery }, responses: { 200: { description: "List Evidence Requests records", content: { "application/json": { schema: dtoEvidenceRequestsCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/evidence-requests/{recordId}", request: { params: validatorEvidenceRequestsRecordParams }, responses: { 200: { description: "View a Evidence Requests record", content: { "application/json": { schema: dtoEvidenceRequestsRecordResponse } } }, 404: { description: "Evidence Requests record not found" } } });
