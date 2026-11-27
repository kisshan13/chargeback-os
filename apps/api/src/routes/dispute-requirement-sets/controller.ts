import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorDisputeRequirementSetsQuery, validatorDisputeRequirementSetsRecordParams } from "./validator.js";

export const controllerListDisputeRequirementSets: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorDisputeRequirementSetsQuery.parse(req.query);
  const collection = syntheticData.disputeRequirementSets;
  return new ApiResponse({ name: "disputeRequirementSets", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic disputeRequirementSets");
});

export const controllerGetDisputeRequirementSetsRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorDisputeRequirementSetsRecordParams.parse(req.params);
  const record = syntheticData.disputeRequirementSets.findById(recordId);
  if (!record) throw new ApiError("Dispute Requirement Sets record not found", 404);
  return new ApiResponse({ collection: "disputeRequirementSets", record }, "Synthetic Dispute Requirement Sets record");
});
