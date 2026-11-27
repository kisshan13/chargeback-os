import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorOrderItemsQuery, validatorOrderItemsRecordParams } from "../routes/order-items/validator.js";

export const dtoOrderItemsCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "OrderItemsCollectionResponse" });
export const dtoOrderItemsRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "OrderItemsRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/order-items", request: { query: validatorOrderItemsQuery }, responses: { 200: { description: "List Order Items records", content: { "application/json": { schema: dtoOrderItemsCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/order-items/{recordId}", request: { params: validatorOrderItemsRecordParams }, responses: { 200: { description: "View a Order Items record", content: { "application/json": { schema: dtoOrderItemsRecordResponse } } }, 404: { description: "Order Items record not found" } } });
