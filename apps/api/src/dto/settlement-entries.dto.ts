import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorSettlementEntriesQuery, validatorSettlementEntriesRecordParams } from "../routes/settlement-entries/validator.js";

export const dtoSettlementEntriesCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "SettlementEntriesCollectionResponse" });
export const dtoSettlementEntriesRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "SettlementEntriesRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/settlement-entries", request: { query: validatorSettlementEntriesQuery }, responses: { 200: { description: "List Settlement Entries records", content: { "application/json": { schema: dtoSettlementEntriesCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/settlement-entries/{recordId}", request: { params: validatorSettlementEntriesRecordParams }, responses: { 200: { description: "View a Settlement Entries record", content: { "application/json": { schema: dtoSettlementEntriesRecordResponse } } }, 404: { description: "Settlement Entries record not found" } } });
