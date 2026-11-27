import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorDisputeReasonCodesQuery, validatorDisputeReasonCodesRecordParams } from "../routes/dispute-reason-codes/validator.js";

export const dtoDisputeReasonCodesCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "DisputeReasonCodesCollectionResponse" });
export const dtoDisputeReasonCodesRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "DisputeReasonCodesRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/dispute-reason-codes", request: { query: validatorDisputeReasonCodesQuery }, responses: { 200: { description: "List Dispute Reason Codes records", content: { "application/json": { schema: dtoDisputeReasonCodesCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/dispute-reason-codes/{recordId}", request: { params: validatorDisputeReasonCodesRecordParams }, responses: { 200: { description: "View a Dispute Reason Codes record", content: { "application/json": { schema: dtoDisputeReasonCodesRecordResponse } } }, 404: { description: "Dispute Reason Codes record not found" } } });
