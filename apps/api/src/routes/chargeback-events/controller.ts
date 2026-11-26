import type { RequestHandler } from "express";
import {
  chargebackEventStreamManager,
  chargebackEventsChannel,
  getChargebackDisputeChannel,
} from "../../lib/chargeback-event-stream.js";
import { validatorChargebackEventsStreamQuery } from "./validator.js";

export const controllerGetChargebackEventsStream: RequestHandler = (req, res, next) => {
  try {
    const query = validatorChargebackEventsStreamQuery.parse(req.query);
    const stream = chargebackEventStreamManager.createStream(req, res, {
      heartbeat: 30_000,
    });
    const channel = query.disputeId
      ? getChargebackDisputeChannel(query.disputeId)
      : chargebackEventsChannel;

    stream.listen(channel);
    stream.message({
      event: "connected",
      data: {
        channel,
        disputeId: query.disputeId ?? null,
        message: "Chargeback event stream connected",
      },
    });
  } catch (error) {
    next(error);
  }
};
