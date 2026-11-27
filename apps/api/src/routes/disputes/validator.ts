import { z } from "zod";

export const validatorDisputesQuery = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0)
});

export const validatorDisputesRecordParams = z.object({ recordId: z.string().trim().min(1) });
export const validatorDisputeApprovalParams = validatorDisputesRecordParams.extend({ approvalId: z.string().trim().min(1) });
export const validatorDisputeApprovalBody = z.object({
  decision: z.enum(["approved", "rejected"]),
  note: z.string().trim().max(2000).optional(),
});

export const validatorCreateDisputeBody = z.object({
  paymentId: z.string().trim().min(1),
  customerClaim: z.string().trim().min(10).max(2000),
  reasonCodeId: z.string().trim().min(1).optional(),
  responseDeadline: z.iso.datetime().optional(),
});
export const validatorStartDisputeDemoRunBody = z.object({
  paymentId: z.string().trim().min(1).optional(),
  customerClaim: z.string().trim().min(10).max(2000).optional(),
  reasonCodeId: z.string().trim().min(1).optional(),
  responseDeadline: z.iso.datetime().optional(),
});
