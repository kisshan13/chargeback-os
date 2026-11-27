import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorOrdersQuery, validatorOrdersRecordParams } from "../routes/orders/validator.js";

export const dtoOrdersCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.object({
    id: z.string(), externalId: z.string(), customerName: z.string(), itemCount: z.number(), fulfillmentStatus: z.string(),
    totalMinor: z.number(), currency: z.string(), status: z.string(), placedAt: z.string(),
  }).passthrough()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "OrdersCollectionResponse" });
export const dtoOrdersRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "OrdersRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/orders", request: { query: validatorOrdersQuery }, responses: { 200: { description: "List Orders records", content: { "application/json": { schema: dtoOrdersCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/orders/{recordId}", request: { params: validatorOrdersRecordParams }, responses: { 200: { description: "View a Orders record", content: { "application/json": { schema: dtoOrdersRecordResponse } } }, 404: { description: "Orders record not found" } } });

export const dtoOrderOverviewResponse = z.object({
  data: z.object({
    order: z.unknown(), customer: z.unknown().nullable(), merchant: z.unknown().nullable(),
    billingAddress: z.unknown().nullable(), shippingAddress: z.unknown().nullable(), items: z.array(z.unknown()),
    payments: z.array(z.unknown()), shipments: z.array(z.unknown()),
  }), message: z.string(), success: z.boolean(),
}).meta({ id: "OrderOverviewResponse" });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/orders/{recordId}/overview", request: { params: validatorOrdersRecordParams }, responses: { 200: { description: "Order details with customer, items, payments, and shipment tracking", content: { "application/json": { schema: dtoOrderOverviewResponse } } }, 404: { description: "Order not found" } } });
