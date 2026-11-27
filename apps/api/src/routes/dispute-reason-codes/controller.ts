import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorDisputeReasonCodesQuery, validatorDisputeReasonCodesRecordParams } from "./validator.js";

export const controllerListDisputeReasonCodes: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorDisputeReasonCodesQuery.parse(req.query);
  const collection = syntheticData.disputeReasonCodes;
  return new ApiResponse({ name: "disputeReasonCodes", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic disputeReasonCodes");
});

export const controllerGetDisputeReasonCodesRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorDisputeReasonCodesRecordParams.parse(req.params);
  const record = syntheticData.disputeReasonCodes.findById(recordId);
  if (!record) throw new ApiError("Dispute Reason Codes record not found", 404);
  return new ApiResponse({ collection: "disputeReasonCodes", record }, "Synthetic Dispute Reason Codes record");
});
