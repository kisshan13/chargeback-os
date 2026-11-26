import { EvStreamManager, type EvMessage } from "evstream";

export const chargebackEventsChannel = "chargeback.events";

export interface ChargebackStreamEvent {
  readonly id: string;
  readonly type: string;
  readonly disputeId?: string;
  readonly data: unknown;
}

export const chargebackEventStreamManager = new EvStreamManager({
  id: "chargeback-api",
  maxConnection: 5000,
  maxListeners: 5000,
});

export function getChargebackDisputeChannel(disputeId: string): string {
  return `${chargebackEventsChannel}:dispute:${disputeId}`;
}

export function publishChargebackStreamEvent(event: ChargebackStreamEvent): void {
  const message: EvMessage = {
    event: event.type,
    id: event.id,
    data: {
      id: event.id,
      type: event.type,
      disputeId: event.disputeId ?? null,
      data: event.data,
    },
  };

  chargebackEventStreamManager.send(chargebackEventsChannel, message);

  if (event.disputeId) {
    chargebackEventStreamManager.send(
      getChargebackDisputeChannel(event.disputeId),
      message,
    );
  }
}
