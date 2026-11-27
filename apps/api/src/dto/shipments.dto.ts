import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorShipmentsQuery, validatorShipmentsRecordParams } from "../routes/shipments/validator.js";

export const dtoShipmentsCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "ShipmentsCollectionResponse" });
export const dtoShipmentsRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "ShipmentsRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/shipments", request: { query: validatorShipmentsQuery }, responses: { 200: { description: "List Shipments records", content: { "application/json": { schema: dtoShipmentsCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/shipments/{recordId}", request: { params: validatorShipmentsRecordParams }, responses: { 200: { description: "View a Shipments record", content: { "application/json": { schema: dtoShipmentsRecordResponse } } }, 404: { description: "Shipments record not found" } } });
