import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorFindingVerificationsQuery, validatorFindingVerificationsRecordParams } from "./validator.js";

export const controllerListFindingVerifications: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorFindingVerificationsQuery.parse(req.query);
  const collection = syntheticData.findingVerifications;
  return new ApiResponse({ name: "findingVerifications", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic findingVerifications");
});

export const controllerGetFindingVerificationsRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorFindingVerificationsRecordParams.parse(req.params);
  const record = syntheticData.findingVerifications.findById(recordId);
  if (!record) throw new ApiError("Finding Verifications record not found", 404);
  return new ApiResponse({ collection: "findingVerifications", record }, "Synthetic Finding Verifications record");
});
