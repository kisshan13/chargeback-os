import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorMessageAttachmentsQuery, validatorMessageAttachmentsRecordParams } from "../routes/message-attachments/validator.js";

export const dtoMessageAttachmentsCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "MessageAttachmentsCollectionResponse" });
export const dtoMessageAttachmentsRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "MessageAttachmentsRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/message-attachments", request: { query: validatorMessageAttachmentsQuery }, responses: { 200: { description: "List Message Attachments records", content: { "application/json": { schema: dtoMessageAttachmentsCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/message-attachments/{recordId}", request: { params: validatorMessageAttachmentsRecordParams }, responses: { 200: { description: "View a Message Attachments record", content: { "application/json": { schema: dtoMessageAttachmentsRecordResponse } } }, 404: { description: "Message Attachments record not found" } } });
