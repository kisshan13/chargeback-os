import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorSourceSystemsQuery, validatorSourceSystemsRecordParams } from "./validator.js";

export const controllerListSourceSystems: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorSourceSystemsQuery.parse(req.query);
  const collection = syntheticData.sourceSystems;
  return new ApiResponse({ name: "sourceSystems", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic sourceSystems");
});

export const controllerGetSourceSystemsRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorSourceSystemsRecordParams.parse(req.params);
  const record = syntheticData.sourceSystems.findById(recordId);
  if (!record) throw new ApiError("Source Systems record not found", 404);
  return new ApiResponse({ collection: "sourceSystems", record }, "Synthetic Source Systems record");
});
