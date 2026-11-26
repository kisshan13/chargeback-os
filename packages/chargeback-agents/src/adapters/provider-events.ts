import type {
  ChargebackSemanticEvent,
  DisputeReceivedPayload,
  ProviderEventEnvelope,
} from "../contracts/events.js";
import { CHARGEBACK_EVENT_TYPES } from "../contracts/events.js";
import type { ChargebackAgentRuntime, PublishResult } from "../core/runtime.js";

export interface ProviderEventNormalizer {
  readonly provider: string;
  normalize(
    envelope: ProviderEventEnvelope,
  ): ChargebackSemanticEvent<DisputeReceivedPayload> | null | Promise<ChargebackSemanticEvent<DisputeReceivedPayload> | null>;
}

export class ProviderEventGateway {
  private readonly normalizers = new Map<string, ProviderEventNormalizer>();

  constructor(private readonly runtime: ChargebackAgentRuntime) {}

  registerNormalizer(normalizer: ProviderEventNormalizer): () => void {
    if (this.normalizers.has(normalizer.provider)) {
      throw new Error(`Provider normalizer already registered: ${normalizer.provider}`);
    }
    this.normalizers.set(normalizer.provider, normalizer);
    return () => this.normalizers.delete(normalizer.provider);
  }

  async ingest(envelope: ProviderEventEnvelope): Promise<PublishResult> {
    const normalizer = this.normalizers.get(envelope.provider);
    if (!normalizer) {
      throw new Error(`No provider normalizer registered: ${envelope.provider}`);
    }

    const event = await normalizer.normalize(envelope);
    if (!event) {
      throw new Error(
        `Provider event is not supported: ${envelope.provider}/${envelope.providerEventType}`,
      );
    }

    return this.runtime.publishEvent(event);
  }
}

export function createDisputeReceivedNormalizer(
  provider: string,
  mapPayload: (envelope: ProviderEventEnvelope) => DisputeReceivedPayload,
): ProviderEventNormalizer {
  return {
    provider,
    normalize(envelope) {
      const occurredAt = envelope.receivedAt;
      return {
        id: `${provider}:${envelope.externalEventId}`,
        type: CHARGEBACK_EVENT_TYPES.disputeReceived,
        entityId: mapPayload(envelope).disputeExternalId,
        sourceSystem: provider,
        externalEventId: envelope.externalEventId,
        idempotencyKey: `${provider}:${envelope.externalEventId}`,
        occurredAt,
        recordedAt: occurredAt,
        payload: mapPayload(envelope),
      };
    },
  };
}

