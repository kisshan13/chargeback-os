import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorPoliciesQuery, validatorPoliciesRecordParams } from "./validator.js";

export const controllerListPolicies: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorPoliciesQuery.parse(req.query);
  const collection = syntheticData.policies;
  const items = collection.findMany({ limit, offset }).map((policy) => {
    const versions = syntheticData.policyVersions.findMany({ where: { policyId: policy.id }, orderBy: { field: "version", direction: "desc" } });
    return { ...policy, versionCount: versions.length, currentVersion: versions[0]?.version ?? null };
  });
  return new ApiResponse({ name: "policies", items, total: collection.length, limit, offset }, "Policies");
});

export const controllerGetPolicyOverview: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorPoliciesRecordParams.parse(req.params);
  const policy = syntheticData.policies.findById(recordId);
  if (!policy) throw new ApiError("Policy not found", 404);
  const versions = syntheticData.policyVersions.findMany({ where: { policyId: policy.id }, orderBy: { field: "version", direction: "desc" } }).map((version) => ({
    ...version,
    clauses: syntheticData.policyClauses.findMany({ where: { policyVersionId: version.id } }),
    sourceDocument: version.sourceDocumentId ? syntheticData.sourceDocuments.findById(version.sourceDocumentId) ?? null : null,
  }));
  return new ApiResponse({ policy, merchant: syntheticData.merchants.findById(policy.merchantId) ?? null, versions }, "Policy overview");
});

export const controllerGetPoliciesRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorPoliciesRecordParams.parse(req.params);
  const record = syntheticData.policies.findById(recordId);
  if (!record) throw new ApiError("Policies record not found", 404);
  return new ApiResponse({ collection: "policies", record }, "Synthetic Policies record");
});
