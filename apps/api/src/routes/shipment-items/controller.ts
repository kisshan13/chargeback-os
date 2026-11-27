import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorShipmentItemsQuery, validatorShipmentItemsRecordParams } from "./validator.js";

export const controllerListShipmentItems: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorShipmentItemsQuery.parse(req.query);
  const collection = syntheticData.shipmentItems;
  return new ApiResponse({ name: "shipmentItems", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic shipmentItems");
});

export const controllerGetShipmentItemsRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorShipmentItemsRecordParams.parse(req.params);
  const record = syntheticData.shipmentItems.findById(recordId);
  if (!record) throw new ApiError("Shipment Items record not found", 404);
  return new ApiResponse({ collection: "shipmentItems", record }, "Synthetic Shipment Items record");
});
