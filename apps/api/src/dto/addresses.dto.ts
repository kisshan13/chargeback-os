import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorAddressesQuery, validatorAddressesRecordParams } from "../routes/addresses/validator.js";

export const dtoAddressesCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.unknown()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "AddressesCollectionResponse" });
export const dtoAddressesRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "AddressesRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/addresses", request: { query: validatorAddressesQuery }, responses: { 200: { description: "List Addresses records", content: { "application/json": { schema: dtoAddressesCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/addresses/{recordId}", request: { params: validatorAddressesRecordParams }, responses: { 200: { description: "View a Addresses record", content: { "application/json": { schema: dtoAddressesRecordResponse } } }, 404: { description: "Addresses record not found" } } });
