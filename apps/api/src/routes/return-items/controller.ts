import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorReturnItemsQuery, validatorReturnItemsRecordParams } from "./validator.js";

export const controllerListReturnItems: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorReturnItemsQuery.parse(req.query);
  const collection = syntheticData.returnItems;
  return new ApiResponse({ name: "returnItems", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic returnItems");
});

export const controllerGetReturnItemsRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorReturnItemsRecordParams.parse(req.params);
  const record = syntheticData.returnItems.findById(recordId);
  if (!record) throw new ApiError("Return Items record not found", 404);
  return new ApiResponse({ collection: "returnItems", record }, "Synthetic Return Items record");
});
