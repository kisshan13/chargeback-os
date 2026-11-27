import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorProductsQuery, validatorProductsRecordParams } from "../routes/products/validator.js";

export const dtoProductsCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.object({ id: z.string(), name: z.string(), sku: z.string(), currentPrice: z.unknown().nullable(), orderCount: z.number(), unitsSold: z.number() }).passthrough()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "ProductsCollectionResponse" });
export const dtoProductsRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "ProductsRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/products", request: { query: validatorProductsQuery }, responses: { 200: { description: "List Products records", content: { "application/json": { schema: dtoProductsCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/products/{recordId}", request: { params: validatorProductsRecordParams }, responses: { 200: { description: "View a Products record", content: { "application/json": { schema: dtoProductsRecordResponse } } }, 404: { description: "Products record not found" } } });

export const dtoProductOverviewResponse = z.object({ data: z.object({ product: z.unknown(), prices: z.array(z.unknown()), orders: z.array(z.unknown()) }), message: z.string(), success: z.boolean() }).meta({ id: "ProductOverviewResponse" });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/products/{recordId}/overview", request: { params: validatorProductsRecordParams }, responses: { 200: { description: "Product with pricing and purchase history", content: { "application/json": { schema: dtoProductOverviewResponse } } }, 404: { description: "Product not found" } } });
