import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorEvidenceQuery, validatorEvidenceRecordParams } from "./validator.js";

export const controllerListEvidence: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorEvidenceQuery.parse(req.query);
  const collection = syntheticData.evidence;
  return new ApiResponse({ name: "evidence", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic evidence");
});

export const controllerGetEvidenceRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorEvidenceRecordParams.parse(req.params);
  const record = syntheticData.evidence.findById(recordId);
  if (!record) throw new ApiError("Evidence record not found", 404);
  return new ApiResponse({ collection: "evidence", record }, "Synthetic Evidence record");
});
