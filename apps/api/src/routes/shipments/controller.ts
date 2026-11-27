import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorShipmentsQuery, validatorShipmentsRecordParams } from "./validator.js";

export const controllerListShipments: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorShipmentsQuery.parse(req.query);
  const collection = syntheticData.shipments;
  return new ApiResponse({ name: "shipments", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic shipments");
});

export const controllerGetShipmentsRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorShipmentsRecordParams.parse(req.params);
  const record = syntheticData.shipments.findById(recordId);
  if (!record) throw new ApiError("Shipments record not found", 404);
  return new ApiResponse({ collection: "shipments", record }, "Synthetic Shipments record");
});
