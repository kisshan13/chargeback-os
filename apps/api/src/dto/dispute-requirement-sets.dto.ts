import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorDisputeRequirementSetsQuery, validatorDisputeRequirementSetsRecordParams } from "../routes/dispute-requirement-sets/validator.js";

export const dtoDisputeRequirementSetsCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "DisputeRequirementSetsCollectionResponse" });
export const dtoDisputeRequirementSetsRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "DisputeRequirementSetsRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/dispute-requirement-sets", request: { query: validatorDisputeRequirementSetsQuery }, responses: { 200: { description: "List Dispute Requirement Sets records", content: { "application/json": { schema: dtoDisputeRequirementSetsCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/dispute-requirement-sets/{recordId}", request: { params: validatorDisputeRequirementSetsRecordParams }, responses: { 200: { description: "View a Dispute Requirement Sets record", content: { "application/json": { schema: dtoDisputeRequirementSetsRecordResponse } } }, 404: { description: "Dispute Requirement Sets record not found" } } });
