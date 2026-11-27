import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorPaymentAuthenticationsQuery, validatorPaymentAuthenticationsRecordParams } from "./validator.js";

export const controllerListPaymentAuthentications: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorPaymentAuthenticationsQuery.parse(req.query);
  const collection = syntheticData.paymentAuthentications;
  return new ApiResponse({ name: "paymentAuthentications", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic paymentAuthentications");
});

export const controllerGetPaymentAuthenticationsRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorPaymentAuthenticationsRecordParams.parse(req.params);
  const record = syntheticData.paymentAuthentications.findById(recordId);
  if (!record) throw new ApiError("Payment Authentications record not found", 404);
  return new ApiResponse({ collection: "paymentAuthentications", record }, "Synthetic Payment Authentications record");
});
