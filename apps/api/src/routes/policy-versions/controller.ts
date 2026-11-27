import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorPolicyVersionsQuery, validatorPolicyVersionsRecordParams } from "./validator.js";

export const controllerListPolicyVersions: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorPolicyVersionsQuery.parse(req.query);
  const collection = syntheticData.policyVersions;
  return new ApiResponse({ name: "policyVersions", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic policyVersions");
});

export const controllerGetPolicyVersionsRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorPolicyVersionsRecordParams.parse(req.params);
  const record = syntheticData.policyVersions.findById(recordId);
  if (!record) throw new ApiError("Policy Versions record not found", 404);
  return new ApiResponse({ collection: "policyVersions", record }, "Synthetic Policy Versions record");
});
