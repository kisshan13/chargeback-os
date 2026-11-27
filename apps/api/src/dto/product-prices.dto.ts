import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorProductPricesQuery, validatorProductPricesRecordParams } from "../routes/product-prices/validator.js";

export const dtoProductPricesCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "ProductPricesCollectionResponse" });
export const dtoProductPricesRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "ProductPricesRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/product-prices", request: { query: validatorProductPricesQuery }, responses: { 200: { description: "List Product Prices records", content: { "application/json": { schema: dtoProductPricesCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/product-prices/{recordId}", request: { params: validatorProductPricesRecordParams }, responses: { 200: { description: "View a Product Prices record", content: { "application/json": { schema: dtoProductPricesRecordResponse } } }, 404: { description: "Product Prices record not found" } } });
