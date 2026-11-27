import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorExpectedOutcomesQuery, validatorExpectedOutcomesRecordParams } from "./validator.js";

export const controllerListExpectedOutcomes: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorExpectedOutcomesQuery.parse(req.query);
  const collection = syntheticData.expectedOutcomes;
  return new ApiResponse({ name: "expectedOutcomes", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic expectedOutcomes");
});

export const controllerGetExpectedOutcomesRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorExpectedOutcomesRecordParams.parse(req.params);
  const record = syntheticData.expectedOutcomes.findById(recordId);
  if (!record) throw new ApiError("Expected Outcomes record not found", 404);
  return new ApiResponse({ collection: "expectedOutcomes", record }, "Synthetic Expected Outcomes record");
});
