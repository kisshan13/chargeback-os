import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorProductPricesQuery, validatorProductPricesRecordParams } from "./validator.js";

export const controllerListProductPrices: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorProductPricesQuery.parse(req.query);
  const collection = syntheticData.productPrices;
  return new ApiResponse({ name: "productPrices", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic productPrices");
});

export const controllerGetProductPricesRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorProductPricesRecordParams.parse(req.params);
  const record = syntheticData.productPrices.findById(recordId);
  if (!record) throw new ApiError("Product Prices record not found", 404);
  return new ApiResponse({ collection: "productPrices", record }, "Synthetic Product Prices record");
});
