import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorOrderItemsQuery, validatorOrderItemsRecordParams } from "./validator.js";

export const controllerListOrderItems: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorOrderItemsQuery.parse(req.query);
  const collection = syntheticData.orderItems;
  return new ApiResponse({ name: "orderItems", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic orderItems");
});

export const controllerGetOrderItemsRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorOrderItemsRecordParams.parse(req.params);
  const record = syntheticData.orderItems.findById(recordId);
  if (!record) throw new ApiError("Order Items record not found", 404);
  return new ApiResponse({ collection: "orderItems", record }, "Synthetic Order Items record");
});
