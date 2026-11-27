import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorDigitalFulfillmentEventsQuery, validatorDigitalFulfillmentEventsRecordParams } from "../routes/digital-fulfillment-events/validator.js";

export const dtoDigitalFulfillmentEventsCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "DigitalFulfillmentEventsCollectionResponse" });
export const dtoDigitalFulfillmentEventsRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "DigitalFulfillmentEventsRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/digital-fulfillment-events", request: { query: validatorDigitalFulfillmentEventsQuery }, responses: { 200: { description: "List Digital Fulfillment Events records", content: { "application/json": { schema: dtoDigitalFulfillmentEventsCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/digital-fulfillment-events/{recordId}", request: { params: validatorDigitalFulfillmentEventsRecordParams }, responses: { 200: { description: "View a Digital Fulfillment Events record", content: { "application/json": { schema: dtoDigitalFulfillmentEventsRecordResponse } } }, 404: { description: "Digital Fulfillment Events record not found" } } });
