import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorCustomersQuery, validatorCustomersRecordParams } from "../routes/customers/validator.js";

export const dtoCustomersCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.object({
    id: z.string(), fullName: z.string(), email: z.string(), orderCount: z.number(), lifetimeValueMinor: z.number(),
  }).passthrough()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "CustomersCollectionResponse" });
export const dtoCustomersRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "CustomersRecordResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/customers", request: { query: validatorCustomersQuery }, responses: { 200: { description: "List Customers records", content: { "application/json": { schema: dtoCustomersCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/customers/{recordId}", request: { params: validatorCustomersRecordParams }, responses: { 200: { description: "View a Customers record", content: { "application/json": { schema: dtoCustomersRecordResponse } } }, 404: { description: "Customers record not found" } } });

export const dtoCustomerOverviewResponse = z.object({
  data: z.object({
    customer: z.unknown(), merchant: z.unknown().nullable(), addresses: z.array(z.unknown()),
    paymentMethods: z.array(z.unknown()), payments: z.array(z.unknown()), disputes: z.array(z.unknown()),
    orders: z.array(z.unknown()),
  }), message: z.string(), success: z.boolean(),
}).meta({ id: "CustomerOverviewResponse" });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/customers/{recordId}/overview", request: { params: validatorCustomersRecordParams }, responses: { 200: { description: "Customer profile with addresses, purchases, payments, and disputes", content: { "application/json": { schema: dtoCustomerOverviewResponse } } }, 404: { description: "Customer not found" } } });
