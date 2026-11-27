import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorDisputeRequirementsQuery, validatorDisputeRequirementsRecordParams } from "./validator.js";

export const controllerListDisputeRequirements: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorDisputeRequirementsQuery.parse(req.query);
  const collection = syntheticData.disputeRequirements;
  return new ApiResponse({ name: "disputeRequirements", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic disputeRequirements");
});

export const controllerGetDisputeRequirementsRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorDisputeRequirementsRecordParams.parse(req.params);
  const record = syntheticData.disputeRequirements.findById(recordId);
  if (!record) throw new ApiError("Dispute Requirements record not found", 404);
  return new ApiResponse({ collection: "disputeRequirements", record }, "Synthetic Dispute Requirements record");
});
