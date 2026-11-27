import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorConversationsQuery, validatorConversationsRecordParams } from "./validator.js";

export const controllerListConversations: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorConversationsQuery.parse(req.query);
  const collection = syntheticData.conversations;
  return new ApiResponse({ name: "conversations", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic conversations");
});

export const controllerGetConversationsRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorConversationsRecordParams.parse(req.params);
  const record = syntheticData.conversations.findById(recordId);
  if (!record) throw new ApiError("Conversations record not found", 404);
  return new ApiResponse({ collection: "conversations", record }, "Synthetic Conversations record");
});
