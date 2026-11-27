import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorDisputeRequirementsQuery, validatorDisputeRequirementsRecordParams } from "../routes/dispute-requirements/validator.js";

export const dtoDisputeRequirementsCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "DisputeRequirementsCollectionResponse" });
export const dtoDisputeRequirementsRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "DisputeRequirementsRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/dispute-requirements", request: { query: validatorDisputeRequirementsQuery }, responses: { 200: { description: "List Dispute Requirements records", content: { "application/json": { schema: dtoDisputeRequirementsCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/dispute-requirements/{recordId}", request: { params: validatorDisputeRequirementsRecordParams }, responses: { 200: { description: "View a Dispute Requirements record", content: { "application/json": { schema: dtoDisputeRequirementsRecordResponse } } }, 404: { description: "Dispute Requirements record not found" } } });
