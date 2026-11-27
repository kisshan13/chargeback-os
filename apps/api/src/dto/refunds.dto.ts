import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorRefundsQuery, validatorRefundsRecordParams } from "../routes/refunds/validator.js";

export const dtoRefundsCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "RefundsCollectionResponse" });
export const dtoRefundsRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "RefundsRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/refunds", request: { query: validatorRefundsQuery }, responses: { 200: { description: "List Refunds records", content: { "application/json": { schema: dtoRefundsCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/refunds/{recordId}", request: { params: validatorRefundsRecordParams }, responses: { 200: { description: "View a Refunds record", content: { "application/json": { schema: dtoRefundsRecordResponse } } }, 404: { description: "Refunds record not found" } } });
