import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorContradictionEvidenceQuery, validatorContradictionEvidenceRecordParams } from "./validator.js";

export const controllerListContradictionEvidence: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorContradictionEvidenceQuery.parse(req.query);
  const collection = syntheticData.contradictionEvidence;
  return new ApiResponse({ name: "contradictionEvidence", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic contradictionEvidence");
});

export const controllerGetContradictionEvidenceRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorContradictionEvidenceRecordParams.parse(req.params);
  const record = syntheticData.contradictionEvidence.findById(recordId);
  if (!record) throw new ApiError("Contradiction Evidence record not found", 404);
  return new ApiResponse({ collection: "contradictionEvidence", record }, "Synthetic Contradiction Evidence record");
});
