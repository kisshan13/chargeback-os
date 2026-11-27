import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorInvestigationRunsQuery, validatorInvestigationRunsRecordParams } from "../routes/investigation-runs/validator.js";

export const dtoInvestigationRunsCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "InvestigationRunsCollectionResponse" });
export const dtoInvestigationRunsRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "InvestigationRunsRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/investigation-runs", request: { query: validatorInvestigationRunsQuery }, responses: { 200: { description: "List Investigation Runs records", content: { "application/json": { schema: dtoInvestigationRunsCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/investigation-runs/{recordId}", request: { params: validatorInvestigationRunsRecordParams }, responses: { 200: { description: "View a Investigation Runs record", content: { "application/json": { schema: dtoInvestigationRunsRecordResponse } } }, 404: { description: "Investigation Runs record not found" } } });
