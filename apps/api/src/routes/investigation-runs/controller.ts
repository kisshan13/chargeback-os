import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorInvestigationRunsQuery, validatorInvestigationRunsRecordParams } from "./validator.js";

export const controllerListInvestigationRuns: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorInvestigationRunsQuery.parse(req.query);
  const collection = syntheticData.investigationRuns;
  return new ApiResponse({ name: "investigationRuns", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic investigationRuns");
});

export const controllerGetInvestigationRunsRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorInvestigationRunsRecordParams.parse(req.params);
  const record = syntheticData.investigationRuns.findById(recordId);
  if (!record) throw new ApiError("Investigation Runs record not found", 404);
  return new ApiResponse({ collection: "investigationRuns", record }, "Synthetic Investigation Runs record");
});
