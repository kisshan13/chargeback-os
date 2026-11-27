import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorSourceDocumentsQuery, validatorSourceDocumentsRecordParams } from "./validator.js";

export const controllerListSourceDocuments: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorSourceDocumentsQuery.parse(req.query);
  const collection = syntheticData.sourceDocuments;
  return new ApiResponse({ name: "sourceDocuments", items: collection.findMany({ limit, offset }), total: collection.length, limit, offset }, "Synthetic sourceDocuments");
});

export const controllerGetSourceDocumentsRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorSourceDocumentsRecordParams.parse(req.params);
  const record = syntheticData.sourceDocuments.findById(recordId);
  if (!record) throw new ApiError("Source Documents record not found", 404);
  return new ApiResponse({ collection: "sourceDocuments", record }, "Synthetic Source Documents record");
});
