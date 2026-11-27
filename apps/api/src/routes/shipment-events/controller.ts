import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorShipmentEventsQuery, validatorShipmentEventsRecordParams } from "./validator.js";

export const controllerListShipmentEvents: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorShipmentEventsQuery.parse(req.query);
  const collection = syntheticData.shipmentEvents;
  return new ApiResponse({ name: "shipmentEvents", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic shipmentEvents");
});

export const controllerGetShipmentEventsRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorShipmentEventsRecordParams.parse(req.params);
  const record = syntheticData.shipmentEvents.findById(recordId);
  if (!record) throw new ApiError("Shipment Events record not found", 404);
  return new ApiResponse({ collection: "shipmentEvents", record }, "Synthetic Shipment Events record");
});
