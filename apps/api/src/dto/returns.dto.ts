import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorReturnsQuery, validatorReturnsRecordParams } from "../routes/returns/validator.js";

export const dtoReturnsCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "ReturnsCollectionResponse" });
export const dtoReturnsRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "ReturnsRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/returns", request: { query: validatorReturnsQuery }, responses: { 200: { description: "List Returns records", content: { "application/json": { schema: dtoReturnsCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/returns/{recordId}", request: { params: validatorReturnsRecordParams }, responses: { 200: { description: "View a Returns record", content: { "application/json": { schema: dtoReturnsRecordResponse } } }, 404: { description: "Returns record not found" } } });
