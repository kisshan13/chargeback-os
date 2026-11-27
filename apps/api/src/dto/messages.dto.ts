import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorMessagesQuery, validatorMessagesRecordParams } from "../routes/messages/validator.js";

export const dtoMessagesCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "MessagesCollectionResponse" });
export const dtoMessagesRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "MessagesRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/messages", request: { query: validatorMessagesQuery }, responses: { 200: { description: "List Messages records", content: { "application/json": { schema: dtoMessagesCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/messages/{recordId}", request: { params: validatorMessagesRecordParams }, responses: { 200: { description: "View a Messages record", content: { "application/json": { schema: dtoMessagesRecordResponse } } }, 404: { description: "Messages record not found" } } });
