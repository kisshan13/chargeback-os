import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorShipmentEventsQuery, validatorShipmentEventsRecordParams } from "../routes/shipment-events/validator.js";

export const dtoShipmentEventsCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "ShipmentEventsCollectionResponse" });
export const dtoShipmentEventsRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "ShipmentEventsRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/shipment-events", request: { query: validatorShipmentEventsQuery }, responses: { 200: { description: "List Shipment Events records", content: { "application/json": { schema: dtoShipmentEventsCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/shipment-events/{recordId}", request: { params: validatorShipmentEventsRecordParams }, responses: { 200: { description: "View a Shipment Events record", content: { "application/json": { schema: dtoShipmentEventsRecordResponse } } }, 404: { description: "Shipment Events record not found" } } });
