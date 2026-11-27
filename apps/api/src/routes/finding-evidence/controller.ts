import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorFindingEvidenceQuery, validatorFindingEvidenceRecordParams } from "./validator.js";

export const controllerListFindingEvidence: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorFindingEvidenceQuery.parse(req.query);
  const collection = syntheticData.findingEvidence;
  return new ApiResponse({ name: "findingEvidence", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic findingEvidence");
});

export const controllerGetFindingEvidenceRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorFindingEvidenceRecordParams.parse(req.params);
  const record = syntheticData.findingEvidence.findById(recordId);
  if (!record) throw new ApiError("Finding Evidence record not found", 404);
  return new ApiResponse({ collection: "findingEvidence", record }, "Synthetic Finding Evidence record");
});
