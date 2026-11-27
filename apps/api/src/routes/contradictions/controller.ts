import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorContradictionsQuery, validatorContradictionsRecordParams } from "./validator.js";

export const controllerListContradictions: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorContradictionsQuery.parse(req.query);
  const collection = syntheticData.contradictions;
  return new ApiResponse({ name: "contradictions", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic contradictions");
});

export const controllerGetContradictionsRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorContradictionsRecordParams.parse(req.params);
  const record = syntheticData.contradictions.findById(recordId);
  if (!record) throw new ApiError("Contradictions record not found", 404);
  return new ApiResponse({ collection: "contradictions", record }, "Synthetic Contradictions record");
});
