import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorPolicyClausesQuery, validatorPolicyClausesRecordParams } from "./validator.js";

export const controllerListPolicyClauses: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorPolicyClausesQuery.parse(req.query);
  const collection = syntheticData.policyClauses;
  return new ApiResponse({ name: "policyClauses", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic policyClauses");
});

export const controllerGetPolicyClausesRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorPolicyClausesRecordParams.parse(req.params);
  const record = syntheticData.policyClauses.findById(recordId);
  if (!record) throw new ApiError("Policy Clauses record not found", 404);
  return new ApiResponse({ collection: "policyClauses", record }, "Synthetic Policy Clauses record");
});
