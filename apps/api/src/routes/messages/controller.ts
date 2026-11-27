import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorMessagesQuery, validatorMessagesRecordParams } from "./validator.js";

export const controllerListMessages: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorMessagesQuery.parse(req.query);
  const collection = syntheticData.messages;
  return new ApiResponse({ name: "messages", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic messages");
});

export const controllerGetMessagesRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorMessagesRecordParams.parse(req.params);
  const record = syntheticData.messages.findById(recordId);
  if (!record) throw new ApiError("Messages record not found", 404);
  return new ApiResponse({ collection: "messages", record }, "Synthetic Messages record");
});
