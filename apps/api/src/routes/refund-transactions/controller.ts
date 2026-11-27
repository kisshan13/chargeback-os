import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorRefundTransactionsQuery, validatorRefundTransactionsRecordParams } from "./validator.js";

export const controllerListRefundTransactions: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorRefundTransactionsQuery.parse(req.query);
  const collection = syntheticData.refundTransactions;
  return new ApiResponse({ name: "refundTransactions", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic refundTransactions");
});

export const controllerGetRefundTransactionsRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorRefundTransactionsRecordParams.parse(req.params);
  const record = syntheticData.refundTransactions.findById(recordId);
  if (!record) throw new ApiError("Refund Transactions record not found", 404);
  return new ApiResponse({ collection: "refundTransactions", record }, "Synthetic Refund Transactions record");
});
