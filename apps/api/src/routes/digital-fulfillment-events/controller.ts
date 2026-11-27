import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorDigitalFulfillmentEventsQuery, validatorDigitalFulfillmentEventsRecordParams } from "./validator.js";

export const controllerListDigitalFulfillmentEvents: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorDigitalFulfillmentEventsQuery.parse(req.query);
  const collection = syntheticData.digitalFulfillmentEvents;
  return new ApiResponse({ name: "digitalFulfillmentEvents", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic digitalFulfillmentEvents");
});

export const controllerGetDigitalFulfillmentEventsRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorDigitalFulfillmentEventsRecordParams.parse(req.params);
  const record = syntheticData.digitalFulfillmentEvents.findById(recordId);
  if (!record) throw new ApiError("Digital Fulfillment Events record not found", 404);
  return new ApiResponse({ collection: "digitalFulfillmentEvents", record }, "Synthetic Digital Fulfillment Events record");
});
