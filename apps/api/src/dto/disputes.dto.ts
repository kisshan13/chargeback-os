import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorCreateDisputeBody, validatorDisputeApprovalBody, validatorDisputeApprovalParams, validatorDisputesQuery, validatorDisputesRecordParams, validatorStartDisputeDemoRunBody } from "../routes/disputes/validator.js";

export const dtoDisputesCollectionResponse = z.object({
  data: z.object({ name: z.string(), items: z.array(z.object({ id: z.string(), reasonName: z.string(), customerName: z.string(), orderReference: z.string(), merchantName: z.string() }).passthrough()), total: z.number(), limit: z.number(), offset: z.number() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "DisputesCollectionResponse" });
export const dtoDisputesRecordResponse = z.object({
  data: z.object({ collection: z.string(), record: z.unknown() }),
  message: z.string(),
  success: z.boolean()
}).meta({ id: "DisputesRecordResponse" });

export const dtoDisputeRunResponse = z.object({
  data: z.object({
    disputeId: z.string(),
    status: z.enum(["running", "awaiting_approval", "completed", "failed", "not_started"]),
    events: z.array(z.object({ id: z.string(), type: z.string(), disputeId: z.string().nullable().optional(), data: z.unknown(), recordedAt: z.string().optional() }).passthrough()),
  }),
  message: z.string(),
  success: z.boolean(),
}).meta({ id: "DisputeRunResponse" });

openApiRegistry.registerPath({ method: "get", path: "/api/v1/disputes", request: { query: validatorDisputesQuery }, responses: { 200: { description: "List Disputes records", content: { "application/json": { schema: dtoDisputesCollectionResponse } } } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/disputes/{recordId}", request: { params: validatorDisputesRecordParams }, responses: { 200: { description: "View a Disputes record", content: { "application/json": { schema: dtoDisputesRecordResponse } } }, 404: { description: "Disputes record not found" } } });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/disputes/{recordId}/run", request: { params: validatorDisputesRecordParams }, responses: { 200: { description: "Replay events and processing status for a dispute simulation", content: { "application/json": { schema: dtoDisputeRunResponse } } }, 404: { description: "Dispute not found" } } });
export const dtoDisputeApprovalResponse = z.object({ data: z.object({ disputeId: z.string(), approvalId: z.string(), decision: z.enum(["approved", "rejected"]) }), message: z.string(), success: z.boolean() }).meta({ id: "DisputeApprovalResponse" });
openApiRegistry.registerPath({ method: "post", path: "/api/v1/disputes/{recordId}/approvals/{approvalId}", request: { params: validatorDisputeApprovalParams, body: { content: { "application/json": { schema: validatorDisputeApprovalBody } } } }, responses: { 200: { description: "Record a human decision for a pending dispute response", content: { "application/json": { schema: dtoDisputeApprovalResponse } } }, 409: { description: "Approval is no longer pending" } } });

export const dtoDisputeOverviewResponse = z.object({ data: z.object({ dispute: z.unknown(), merchant: z.unknown().nullable(), reasonCode: z.unknown().nullable(), requirementSet: z.unknown().nullable(), requirements: z.array(z.unknown()), payment: z.unknown().nullable(), customer: z.unknown().nullable(), customerAddresses: z.array(z.unknown()), order: z.unknown().nullable(), disputeEvents: z.array(z.unknown()), investigationEvents: z.array(z.unknown()) }), message: z.string(), success: z.boolean() }).meta({ id: "DisputeOverviewResponse" });
openApiRegistry.registerPath({ method: "get", path: "/api/v1/disputes/{recordId}/overview", request: { params: validatorDisputesRecordParams }, responses: { 200: { description: "Dispute case with reason, evidence requirements, customer, order, payment, policy, and fulfillment context", content: { "application/json": { schema: dtoDisputeOverviewResponse } } }, 404: { description: "Dispute not found" } } });

export const dtoCreateDisputeResponse = z.object({
  data: z.object({ dispute: z.unknown(), eventId: z.string(), streamUrl: z.string() }),
  message: z.string(),
  success: z.boolean(),
}).meta({ id: "CreateDisputeResponse" });

export const dtoStartDisputeDemoRunResponse = z.object({
  data: z.object({ dispute: z.unknown(), eventId: z.string(), eventCount: z.number(), isDemo: z.literal(true), streamUrl: z.string() }),
  message: z.string(),
  success: z.boolean(),
}).meta({ id: "StartDisputeDemoRunResponse" });

openApiRegistry.registerPath({ method: "post", path: "/api/v1/disputes/demo-runs", request: { body: { content: { "application/json": { schema: validatorStartDisputeDemoRunBody } } } }, responses: { 201: { description: "Replay a saved dispute run as a key-free Evstream demo", content: { "application/json": { schema: dtoStartDisputeDemoRunResponse } } }, 404: { description: "Payment not found" }, 422: { description: "Payment, transaction, or reason code is invalid" }, 503: { description: "No saved demo runs were found" } } });

openApiRegistry.registerPath({ method: "post", path: "/api/v1/disputes", request: { body: { content: { "application/json": { schema: validatorCreateDisputeBody } } } }, responses: { 201: { description: "Create a synthetic dispute and start the investigation event loop", content: { "application/json": { schema: dtoCreateDisputeResponse } } }, 404: { description: "Payment not found" }, 422: { description: "Payment or dispute reference data is invalid" }, 503: { description: "AI simulation is not configured" } } });
