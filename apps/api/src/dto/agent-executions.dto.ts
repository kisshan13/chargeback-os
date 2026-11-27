import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorAgentExecutionsQuery, validatorAgentExecutionsRecordParams } from "../routes/agent-executions/validator.js";

export const dtoAgentExecutionsCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "AgentExecutionsCollectionResponse" });
export const dtoAgentExecutionsRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "AgentExecutionsRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/agent-executions", request: { query: validatorAgentExecutionsQuery }, responses: { 200: { description: "List Agent Executions records", content: { "application/json": { schema: dtoAgentExecutionsCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/agent-executions/{recordId}", request: { params: validatorAgentExecutionsRecordParams }, responses: { 200: { description: "View a Agent Executions record", content: { "application/json": { schema: dtoAgentExecutionsRecordResponse } } }, 404: { description: "Agent Executions record not found" } } });
