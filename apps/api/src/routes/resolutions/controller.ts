import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorResolutionsQuery, validatorResolutionsRecordParams } from "./validator.js";

export const controllerListResolutions: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorResolutionsQuery.parse(req.query);
  const collection = syntheticData.resolutions;
  return new ApiResponse({ name: "resolutions", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic resolutions");
});

export const controllerGetResolutionsRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorResolutionsRecordParams.parse(req.params);
  const record = syntheticData.resolutions.findById(recordId);
  if (!record) throw new ApiError("Resolutions record not found", 404);
  return new ApiResponse({ collection: "resolutions", record }, "Synthetic Resolutions record");
});
