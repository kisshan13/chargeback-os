import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorOrderPolicyAcceptancesQuery, validatorOrderPolicyAcceptancesRecordParams } from "../routes/order-policy-acceptances/validator.js";

export const dtoOrderPolicyAcceptancesCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "OrderPolicyAcceptancesCollectionResponse" });
export const dtoOrderPolicyAcceptancesRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "OrderPolicyAcceptancesRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/order-policy-acceptances", request: { query: validatorOrderPolicyAcceptancesQuery }, responses: { 200: { description: "List Order Policy Acceptances records", content: { "application/json": { schema: dtoOrderPolicyAcceptancesCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/order-policy-acceptances/{recordId}", request: { params: validatorOrderPolicyAcceptancesRecordParams }, responses: { 200: { description: "View a Order Policy Acceptances record", content: { "application/json": { schema: dtoOrderPolicyAcceptancesRecordResponse } } }, 404: { description: "Order Policy Acceptances record not found" } } });
