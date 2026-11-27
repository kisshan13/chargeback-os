import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorAgentExecutionsQuery, validatorAgentExecutionsRecordParams } from "./validator.js";

export const controllerListAgentExecutions: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorAgentExecutionsQuery.parse(req.query);
  const collection = syntheticData.agentExecutions;
  return new ApiResponse({ name: "agentExecutions", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic agentExecutions");
});

export const controllerGetAgentExecutionsRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorAgentExecutionsRecordParams.parse(req.params);
  const record = syntheticData.agentExecutions.findById(recordId);
  if (!record) throw new ApiError("Agent Executions record not found", 404);
  return new ApiResponse({ collection: "agentExecutions", record }, "Synthetic Agent Executions record");
});
