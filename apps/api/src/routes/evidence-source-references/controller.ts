import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorEvidenceSourceReferencesQuery, validatorEvidenceSourceReferencesRecordParams } from "./validator.js";

export const controllerListEvidenceSourceReferences: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorEvidenceSourceReferencesQuery.parse(req.query);
  const collection = syntheticData.evidenceSourceReferences;
  return new ApiResponse({ name: "evidenceSourceReferences", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic evidenceSourceReferences");
});

export const controllerGetEvidenceSourceReferencesRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorEvidenceSourceReferencesRecordParams.parse(req.params);
  const record = syntheticData.evidenceSourceReferences.findById(recordId);
  if (!record) throw new ApiError("Evidence Source References record not found", 404);
  return new ApiResponse({ collection: "evidenceSourceReferences", record }, "Synthetic Evidence Source References record");
});
