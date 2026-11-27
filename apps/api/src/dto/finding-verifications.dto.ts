import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorFindingVerificationsQuery, validatorFindingVerificationsRecordParams } from "../routes/finding-verifications/validator.js";

export const dtoFindingVerificationsCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "FindingVerificationsCollectionResponse" });
export const dtoFindingVerificationsRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "FindingVerificationsRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/finding-verifications", request: { query: validatorFindingVerificationsQuery }, responses: { 200: { description: "List Finding Verifications records", content: { "application/json": { schema: dtoFindingVerificationsCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/finding-verifications/{recordId}", request: { params: validatorFindingVerificationsRecordParams }, responses: { 200: { description: "View a Finding Verifications record", content: { "application/json": { schema: dtoFindingVerificationsRecordResponse } } }, 404: { description: "Finding Verifications record not found" } } });
