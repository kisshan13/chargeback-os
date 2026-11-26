import { z } from "zod";
import { openApiRegistry } from "../openapi/registry.js";
import { validatorChargebackEventsStreamQuery } from "../routes/chargeback-events/validator.js";

export const dtoChargebackEventStreamMessage = z.object({
  id: z.string(),
  type: z.string(),
  disputeId: z.string().nullable(),
  data: z.unknown(),
}).meta({ id: "ChargebackEventStreamMessage" });

export const dtoChargebackEventsStreamResponseEnvelope = z.object({
  event: z.string(),
  id: z.string().optional(),
  data: dtoChargebackEventStreamMessage,
}).meta({ id: "ChargebackEventsStreamResponseEnvelope" });

openApiRegistry.registerPath({
  method: "get",
  path: "/api/v1/chargebacks/events/stream",
  request: { query: validatorChargebackEventsStreamQuery },
  responses: {
    200: {
      description: "Public Server-Sent Events stream for ChargebackOS events",
      content: {
        "text/event-stream": {
          schema: dtoChargebackEventsStreamResponseEnvelope,
        },
      },
    },
  },
});
