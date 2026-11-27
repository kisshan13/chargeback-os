import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorDisputeItemsQuery, validatorDisputeItemsRecordParams } from "./validator.js";

export const controllerListDisputeItems: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorDisputeItemsQuery.parse(req.query);
  const collection = syntheticData.disputeItems;
  return new ApiResponse({ name: "disputeItems", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic disputeItems");
});

export const controllerGetDisputeItemsRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorDisputeItemsRecordParams.parse(req.params);
  const record = syntheticData.disputeItems.findById(recordId);
  if (!record) throw new ApiError("Dispute Items record not found", 404);
  return new ApiResponse({ collection: "disputeItems", record }, "Synthetic Dispute Items record");
});
