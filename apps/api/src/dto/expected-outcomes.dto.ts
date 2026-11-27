import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorExpectedOutcomesQuery, validatorExpectedOutcomesRecordParams } from "../routes/expected-outcomes/validator.js";

export const dtoExpectedOutcomesCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "ExpectedOutcomesCollectionResponse" });
export const dtoExpectedOutcomesRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "ExpectedOutcomesRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/expected-outcomes", request: { query: validatorExpectedOutcomesQuery }, responses: { 200: { description: "List Expected Outcomes records", content: { "application/json": { schema: dtoExpectedOutcomesCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/expected-outcomes/{recordId}", request: { params: validatorExpectedOutcomesRecordParams }, responses: { 200: { description: "View a Expected Outcomes record", content: { "application/json": { schema: dtoExpectedOutcomesRecordResponse } } }, 404: { description: "Expected Outcomes record not found" } } });
