import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorFindingsQuery, validatorFindingsRecordParams } from "./validator.js";

export const controllerListFindings: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorFindingsQuery.parse(req.query);
  const collection = syntheticData.findings;
  return new ApiResponse({ name: "findings", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic findings");
});

export const controllerGetFindingsRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorFindingsRecordParams.parse(req.params);
  const record = syntheticData.findings.findById(recordId);
  if (!record) throw new ApiError("Findings record not found", 404);
  return new ApiResponse({ collection: "findings", record }, "Synthetic Findings record");
});
