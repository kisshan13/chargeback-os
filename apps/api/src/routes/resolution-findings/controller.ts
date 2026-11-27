import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorResolutionFindingsQuery, validatorResolutionFindingsRecordParams } from "./validator.js";

export const controllerListResolutionFindings: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorResolutionFindingsQuery.parse(req.query);
  const collection = syntheticData.resolutionFindings;
  return new ApiResponse({ name: "resolutionFindings", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic resolutionFindings");
});

export const controllerGetResolutionFindingsRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorResolutionFindingsRecordParams.parse(req.params);
  const record = syntheticData.resolutionFindings.findById(recordId);
  if (!record) throw new ApiError("Resolution Findings record not found", 404);
  return new ApiResponse({ collection: "resolutionFindings", record }, "Synthetic Resolution Findings record");
});
