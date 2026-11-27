import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorPolicyVersionsQuery, validatorPolicyVersionsRecordParams } from "../routes/policy-versions/validator.js";

export const dtoPolicyVersionsCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "PolicyVersionsCollectionResponse" });
export const dtoPolicyVersionsRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "PolicyVersionsRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/policy-versions", request: { query: validatorPolicyVersionsQuery }, responses: { 200: { description: "List Policy Versions records", content: { "application/json": { schema: dtoPolicyVersionsCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/policy-versions/{recordId}", request: { params: validatorPolicyVersionsRecordParams }, responses: { 200: { description: "View a Policy Versions record", content: { "application/json": { schema: dtoPolicyVersionsRecordResponse } } }, 404: { description: "Policy Versions record not found" } } });
