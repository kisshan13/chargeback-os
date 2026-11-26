import { SemanticEvent } from "@mozaik-ai/core";
import type { ChargebackSemanticEvent } from "../contracts/events.js";

export function toMozaikEvent(
  event: ChargebackSemanticEvent,
  producerId: string,
): SemanticEvent {
  return SemanticEvent.create(event.type, producerId, event);
}

