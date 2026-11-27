import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorPaymentMethodsQuery, validatorPaymentMethodsRecordParams } from "./validator.js";

export const controllerListPaymentMethods: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorPaymentMethodsQuery.parse(req.query);
  const collection = syntheticData.paymentMethods;
  return new ApiResponse({ name: "paymentMethods", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic paymentMethods");
});

export const controllerGetPaymentMethodsRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorPaymentMethodsRecordParams.parse(req.params);
  const record = syntheticData.paymentMethods.findById(recordId);
  if (!record) throw new ApiError("Payment Methods record not found", 404);
  return new ApiResponse({ collection: "paymentMethods", record }, "Synthetic Payment Methods record");
});
