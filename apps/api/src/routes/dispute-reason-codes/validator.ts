import { z } from "zod";

export const validatorDisputeReasonCodesQuery = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0)
});

export const validatorDisputeReasonCodesRecordParams = z.object({ recordId: z.string().trim().min(1) });
