import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorTransactionsQuery, validatorTransactionsRecordParams } from "./validator.js";

export const controllerListTransactions: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorTransactionsQuery.parse(req.query);
  const collection = syntheticData.transactions;
  return new ApiResponse({ name: "transactions", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic transactions");
});

export const controllerGetTransactionsRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorTransactionsRecordParams.parse(req.params);
  const record = syntheticData.transactions.findById(recordId);
  if (!record) throw new ApiError("Transactions record not found", 404);
  return new ApiResponse({ collection: "transactions", record }, "Synthetic Transactions record");
});
