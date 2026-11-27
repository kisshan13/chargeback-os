import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorOrderPolicyAcceptancesQuery, validatorOrderPolicyAcceptancesRecordParams } from "./validator.js";

export const controllerListOrderPolicyAcceptances: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorOrderPolicyAcceptancesQuery.parse(req.query);
  const collection = syntheticData.orderPolicyAcceptances;
  return new ApiResponse({ name: "orderPolicyAcceptances", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic orderPolicyAcceptances");
});

export const controllerGetOrderPolicyAcceptancesRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorOrderPolicyAcceptancesRecordParams.parse(req.params);
  const record = syntheticData.orderPolicyAcceptances.findById(recordId);
  if (!record) throw new ApiError("Order Policy Acceptances record not found", 404);
  return new ApiResponse({ collection: "orderPolicyAcceptances", record }, "Synthetic Order Policy Acceptances record");
});
