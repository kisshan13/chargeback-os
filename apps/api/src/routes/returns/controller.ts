import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorReturnsQuery, validatorReturnsRecordParams } from "./validator.js";

export const controllerListReturns: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorReturnsQuery.parse(req.query);
  const collection = syntheticData.returns;
  return new ApiResponse({ name: "returns", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic returns");
});

export const controllerGetReturnsRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorReturnsRecordParams.parse(req.params);
  const record = syntheticData.returns.findById(recordId);
  if (!record) throw new ApiError("Returns record not found", 404);
  return new ApiResponse({ collection: "returns", record }, "Synthetic Returns record");
});
