import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorPoliciesQuery, validatorPoliciesRecordParams } from "../routes/policies/validator.js";

export const dtoPoliciesCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.object({ id: z.string(), name: z.string(), type: z.string(), versionCount: z.number(), currentVersion: z.number().nullable() }).passthrough()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "PoliciesCollectionResponse" });
export const dtoPoliciesRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "PoliciesRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/policies", request: { query: validatorPoliciesQuery }, responses: { 200: { description: "List Policies records", content: { "application/json": { schema: dtoPoliciesCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/policies/{recordId}", request: { params: validatorPoliciesRecordParams }, responses: { 200: { description: "View a Policies record", content: { "application/json": { schema: dtoPoliciesRecordResponse } } }, 404: { description: "Policies record not found" } } });

export const dtoPolicyOverviewResponse = z.object({ data: z.object({ policy: z.unknown(), merchant: z.unknown().nullable(), versions: z.array(z.unknown()) }), message: z.string(), success: z.boolean() }).meta({ id: "PolicyOverviewResponse" });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/policies/{recordId}/overview", request: { params: validatorPoliciesRecordParams }, responses: { 200: { description: "Policy with version history and clauses", content: { "application/json": { schema: dtoPolicyOverviewResponse } } }, 404: { description: "Policy not found" } } });
