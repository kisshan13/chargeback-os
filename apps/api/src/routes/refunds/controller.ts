import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorRefundsQuery, validatorRefundsRecordParams } from "./validator.js";

export const controllerListRefunds: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorRefundsQuery.parse(req.query);
  const collection = syntheticData.refunds;
  return new ApiResponse({ name: "refunds", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic refunds");
});

export const controllerGetRefundsRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorRefundsRecordParams.parse(req.params);
  const record = syntheticData.refunds.findById(recordId);
  if (!record) throw new ApiError("Refunds record not found", 404);
  return new ApiResponse({ collection: "refunds", record }, "Synthetic Refunds record");
});
