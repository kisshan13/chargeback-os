import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorRefundTransactionsQuery, validatorRefundTransactionsRecordParams } from "../routes/refund-transactions/validator.js";

export const dtoRefundTransactionsCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "RefundTransactionsCollectionResponse" });
export const dtoRefundTransactionsRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "RefundTransactionsRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/refund-transactions", request: { query: validatorRefundTransactionsQuery }, responses: { 200: { description: "List Refund Transactions records", content: { "application/json": { schema: dtoRefundTransactionsCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/refund-transactions/{recordId}", request: { params: validatorRefundTransactionsRecordParams }, responses: { 200: { description: "View a Refund Transactions record", content: { "application/json": { schema: dtoRefundTransactionsRecordResponse } } }, 404: { description: "Refund Transactions record not found" } } });
