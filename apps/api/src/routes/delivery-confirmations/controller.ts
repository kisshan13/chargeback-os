import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorDeliveryConfirmationsQuery, validatorDeliveryConfirmationsRecordParams } from "./validator.js";

export const controllerListDeliveryConfirmations: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorDeliveryConfirmationsQuery.parse(req.query);
  const collection = syntheticData.deliveryConfirmations;
  return new ApiResponse({ name: "deliveryConfirmations", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic deliveryConfirmations");
});

export const controllerGetDeliveryConfirmationsRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorDeliveryConfirmationsRecordParams.parse(req.params);
  const record = syntheticData.deliveryConfirmations.findById(recordId);
  if (!record) throw new ApiError("Delivery Confirmations record not found", 404);
  return new ApiResponse({ collection: "deliveryConfirmations", record }, "Synthetic Delivery Confirmations record");
});
