import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorAddressesQuery, validatorAddressesRecordParams } from "./validator.js";

export const controllerListAddresses: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorAddressesQuery.parse(req.query);
  const collection = syntheticData.addresses;
  return new ApiResponse({ name: "addresses", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic addresses");
});

export const controllerGetAddressesRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorAddressesRecordParams.parse(req.params);
  const record = syntheticData.addresses.findById(recordId);
  if (!record) throw new ApiError("Addresses record not found", 404);
  return new ApiResponse({ collection: "addresses", record }, "Synthetic Addresses record");
});
