import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorConversationsQuery, validatorConversationsRecordParams } from "../routes/conversations/validator.js";

export const dtoConversationsCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "ConversationsCollectionResponse" });
export const dtoConversationsRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "ConversationsRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/conversations", request: { query: validatorConversationsQuery }, responses: { 200: { description: "List Conversations records", content: { "application/json": { schema: dtoConversationsCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/conversations/{recordId}", request: { params: validatorConversationsRecordParams }, responses: { 200: { description: "View a Conversations record", content: { "application/json": { schema: dtoConversationsRecordResponse } } }, 404: { description: "Conversations record not found" } } });
