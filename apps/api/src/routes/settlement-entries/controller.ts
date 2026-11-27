import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorSettlementEntriesQuery, validatorSettlementEntriesRecordParams } from "./validator.js";

export const controllerListSettlementEntries: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorSettlementEntriesQuery.parse(req.query);
  const collection = syntheticData.settlementEntries;
  return new ApiResponse({ name: "settlementEntries", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic settlementEntries");
});

export const controllerGetSettlementEntriesRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorSettlementEntriesRecordParams.parse(req.params);
  const record = syntheticData.settlementEntries.findById(recordId);
  if (!record) throw new ApiError("Settlement Entries record not found", 404);
  return new ApiResponse({ collection: "settlementEntries", record }, "Synthetic Settlement Entries record");
});
