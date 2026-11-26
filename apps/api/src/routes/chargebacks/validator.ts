import { z } from "zod";

export const validatorChargebackDisputesQuery = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
  status: z.enum(["NEEDS_RESPONSE", "UNDER_REVIEW", "ACCEPTED", "WON", "LOST", "CLOSED"]).optional(),
  search: z.string().trim().min(1).optional()
});

export const validatorChargebackDisputeParams = z.object({
  disputeId: z.string().trim().min(1)
});
