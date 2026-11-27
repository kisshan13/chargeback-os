import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorSourceDocumentsQuery, validatorSourceDocumentsRecordParams } from "../routes/source-documents/validator.js";

export const dtoSourceDocumentsCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "SourceDocumentsCollectionResponse" });
export const dtoSourceDocumentsRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "SourceDocumentsRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/source-documents", request: { query: validatorSourceDocumentsQuery }, responses: { 200: { description: "List Source Documents records", content: { "application/json": { schema: dtoSourceDocumentsCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/source-documents/{recordId}", request: { params: validatorSourceDocumentsRecordParams }, responses: { 200: { description: "View a Source Documents record", content: { "application/json": { schema: dtoSourceDocumentsRecordResponse } } }, 404: { description: "Source Documents record not found" } } });
