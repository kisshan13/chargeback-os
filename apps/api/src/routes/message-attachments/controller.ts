import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorMessageAttachmentsQuery, validatorMessageAttachmentsRecordParams } from "./validator.js";

export const controllerListMessageAttachments: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorMessageAttachmentsQuery.parse(req.query);
  const collection = syntheticData.messageAttachments;
  return new ApiResponse({ name: "messageAttachments", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic messageAttachments");
});

export const controllerGetMessageAttachmentsRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorMessageAttachmentsRecordParams.parse(req.params);
  const record = syntheticData.messageAttachments.findById(recordId);
  if (!record) throw new ApiError("Message Attachments record not found", 404);
  return new ApiResponse({ collection: "messageAttachments", record }, "Synthetic Message Attachments record");
});
