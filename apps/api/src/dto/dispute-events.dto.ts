import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorDisputeEventsQuery, validatorDisputeEventsRecordParams } from "../routes/dispute-events/validator.js";

export const dtoDisputeEventsCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "DisputeEventsCollectionResponse" });
export const dtoDisputeEventsRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "DisputeEventsRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/dispute-events", request: { query: validatorDisputeEventsQuery }, responses: { 200: { description: "List Dispute Events records", content: { "application/json": { schema: dtoDisputeEventsCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/dispute-events/{recordId}", request: { params: validatorDisputeEventsRecordParams }, responses: { 200: { description: "View a Dispute Events record", content: { "application/json": { schema: dtoDisputeEventsRecordResponse } } }, 404: { description: "Dispute Events record not found" } } });
