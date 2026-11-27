import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorDisputeEventsQuery, validatorDisputeEventsRecordParams } from "./validator.js";

export const controllerListDisputeEvents: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorDisputeEventsQuery.parse(req.query);
  const collection = syntheticData.disputeEvents;
  return new ApiResponse({ name: "disputeEvents", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic disputeEvents");
});

export const controllerGetDisputeEventsRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorDisputeEventsRecordParams.parse(req.params);
  const record = syntheticData.disputeEvents.findById(recordId);
  if (!record) throw new ApiError("Dispute Events record not found", 404);
  return new ApiResponse({ collection: "disputeEvents", record }, "Synthetic Dispute Events record");
});
