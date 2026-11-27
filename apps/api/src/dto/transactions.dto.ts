import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorTransactionsQuery, validatorTransactionsRecordParams } from "../routes/transactions/validator.js";

export const dtoTransactionsCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "TransactionsCollectionResponse" });
export const dtoTransactionsRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "TransactionsRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/transactions", request: { query: validatorTransactionsQuery }, responses: { 200: { description: "List Transactions records", content: { "application/json": { schema: dtoTransactionsCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/transactions/{recordId}", request: { params: validatorTransactionsRecordParams }, responses: { 200: { description: "View a Transactions record", content: { "application/json": { schema: dtoTransactionsRecordResponse } } }, 404: { description: "Transactions record not found" } } });
