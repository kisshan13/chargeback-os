import { z } from "zod";

export const validatorChargebackEventsStreamQuery = z.object({
  disputeId: z.string().trim().min(1).optional(),
});
