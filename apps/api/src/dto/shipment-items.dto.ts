import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorShipmentItemsQuery, validatorShipmentItemsRecordParams } from "../routes/shipment-items/validator.js";

export const dtoShipmentItemsCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "ShipmentItemsCollectionResponse" });
export const dtoShipmentItemsRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "ShipmentItemsRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/shipment-items", request: { query: validatorShipmentItemsQuery }, responses: { 200: { description: "List Shipment Items records", content: { "application/json": { schema: dtoShipmentItemsCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/shipment-items/{recordId}", request: { params: validatorShipmentItemsRecordParams }, responses: { 200: { description: "View a Shipment Items record", content: { "application/json": { schema: dtoShipmentItemsRecordResponse } } }, 404: { description: "Shipment Items record not found" } } });
