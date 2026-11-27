import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorPolicyClausesQuery, validatorPolicyClausesRecordParams } from "../routes/policy-clauses/validator.js";

export const dtoPolicyClausesCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "PolicyClausesCollectionResponse" });
export const dtoPolicyClausesRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "PolicyClausesRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/policy-clauses", request: { query: validatorPolicyClausesQuery }, responses: { 200: { description: "List Policy Clauses records", content: { "application/json": { schema: dtoPolicyClausesCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/policy-clauses/{recordId}", request: { params: validatorPolicyClausesRecordParams }, responses: { 200: { description: "View a Policy Clauses record", content: { "application/json": { schema: dtoPolicyClausesRecordResponse } } }, 404: { description: "Policy Clauses record not found" } } });
