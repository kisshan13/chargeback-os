import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorMerchantsQuery, validatorMerchantsRecordParams } from "./validator.js";

export const controllerListMerchants: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorMerchantsQuery.parse(req.query);
  const collection = syntheticData.merchants;
  return new ApiResponse({ name: "merchants", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic merchants");
});

export const controllerGetMerchantsRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorMerchantsRecordParams.parse(req.params);
  const record = syntheticData.merchants.findById(recordId);
  if (!record) throw new ApiError("Merchants record not found", 404);
  return new ApiResponse({ collection: "merchants", record }, "Synthetic Merchants record");
});
