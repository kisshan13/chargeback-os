import {
  SemanticEvent,
  SituationSpecification,
  createAgent,
  createHuman,
  defineRuntime,
  type Agent,
  type InferenceInput,
  type SituationContext,
} from "@mozaik-ai/core";
import type {
  AgentLoopOptions,
  ChargebackAgentDefinition,
  RegisteredChargebackAgent,
} from "../contracts/agents.js";
import type {
  ChargebackEventType,
  ChargebackSemanticEvent,
} from "../contracts/events.js";
import { ChargebackRuntimeState } from "./runtime-state.js";

export interface SituationHandlerContext {
  readonly event: ChargebackSemanticEvent;
  readonly runtime: ChargebackAgentRuntime;
  readonly state: ChargebackRuntimeState;
}

export type SituationHandler = (
  context: SituationHandlerContext,
) => void | Promise<void>;

export interface ChargebackParticipant {
  readonly id: string;
  readonly eventTypes: readonly ChargebackEventType[];
  handle(context: SituationHandlerContext): void | Promise<void>;
}

export interface PublishResult {
  readonly accepted: boolean;
  readonly duplicate: boolean;
  readonly eventId: string;
  readonly handlerCount: number;
}

export interface ChargebackAgentRuntimeOptions {
  readonly state?: ChargebackRuntimeState;
  readonly inferenceRunnerConfig?: Parameters<ReturnType<typeof defineRuntime<ChargebackRuntimeState>>["initializeRuntime"]>[0]["inferenceRunnerConfig"];
  readonly onEvent?: (event: ChargebackSemanticEvent) => void;
}

class WhenChargebackEvent extends SituationSpecification {
  constructor(private readonly eventType: ChargebackEventType) {
    super();
  }

  isSatisfiedBy({ event }: SituationContext): boolean {
    return event.type === this.eventType;
  }
}

export class ChargebackAgentRuntime {
  readonly state: ChargebackRuntimeState;

  private readonly mozaik: ReturnType<typeof defineRuntime<ChargebackRuntimeState>>;
  private readonly gateway: ReturnType<typeof createHuman>;
  private readonly agents = new Map<string, RegisteredChargebackAgent>();
  private readonly definitions = new Map<string, ChargebackAgentDefinition>();
  private readonly handlerCounts = new Map<ChargebackEventType, number>();
  private readonly participants = new Map<string, ReturnType<typeof createHuman>>();
  private readonly onEvent?: (event: ChargebackSemanticEvent) => void;

  constructor(options: ChargebackAgentRuntimeOptions = {}) {
    this.state = options.state ?? new ChargebackRuntimeState();
    this.onEvent = options.onEvent;
    this.mozaik = defineRuntime<ChargebackRuntimeState>();
    this.mozaik.initializeRuntime({
      state: this.state,
      inferenceRunnerConfig: options.inferenceRunnerConfig,
    });

    this.gateway = createHuman({
      name: "Chargeback event gateway",
      capabilities: ["chargeback.events"],
      handlers: [],
    });
    this.mozaik.join(this.gateway);
  }

  registerAgent(definition: ChargebackAgentDefinition): RegisteredChargebackAgent {
    if (this.definitions.has(definition.id)) {
      throw new Error(`Chargeback agent already registered: ${definition.id}`);
    }

    const agent = createAgent({
      name: definition.name,
      capabilities: definition.capabilities ?? ["chargeback.investigation", definition.role],
      instruction: definition.instruction,
      tools: [...(definition.tools ?? [])],
      handlers: [],
    });

    this.definitions.set(definition.id, definition);
    this.agents.set(definition.id, agent);
    this.mozaik.join(agent);
    return agent;
  }

  unregisterAgent(agentId: string): void {
    const agent = this.agents.get(agentId);
    if (!agent) {
      return;
    }

    this.mozaik.leave(agent);
    this.agents.delete(agentId);
    this.definitions.delete(agentId);
  }

  getAgent(agentId: string): RegisteredChargebackAgent {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Chargeback agent is not registered: ${agentId}`);
    }
    return agent;
  }

  registerSituationHandler(
    eventType: ChargebackEventType,
    handler: SituationHandler,
  ): () => void {
    const situationHandler: import("@mozaik-ai/core").SituationHandler = {
      specification: new WhenChargebackEvent(eventType),
      processor: {
        apply: ({ event }) => {
          const chargebackEvent = event.payload as ChargebackSemanticEvent;
          void handler({ event: chargebackEvent, runtime: this, state: this.state });
        },
      },
    };
    const participant = createHuman({
      name: `Chargeback ${eventType} handler`,
      capabilities: [`chargeback.handler.${eventType}`],
      handlers: [situationHandler],
    });

    this.mozaik.join(participant);
    const currentCount = this.handlerCounts.get(eventType) ?? 0;
    this.handlerCounts.set(eventType, currentCount + 1);
    const handlerId = `${eventType}:${participant.getId()}`;
    this.participants.set(handlerId, participant);

    return () => {
      this.mozaik.leave(participant);
      this.participants.delete(handlerId);
      const remaining = (this.handlerCounts.get(eventType) ?? 1) - 1;
      if (remaining > 0) {
        this.handlerCounts.set(eventType, remaining);
      } else {
        this.handlerCounts.delete(eventType);
      }
    };
  }

  registerParticipant(participant: ChargebackParticipant): () => void {
    const unregister = participant.eventTypes.map((eventType) =>
      this.registerSituationHandler(eventType, (context) => participant.handle(context)),
    );
    return () => unregister.forEach((remove) => remove());
  }

  publishEvent(event: ChargebackSemanticEvent): PublishResult {
    if (this.state.hasProcessedEvent(event.idempotencyKey)) {
      return {
        accepted: false,
        duplicate: true,
        eventId: event.id,
        handlerCount: 0,
      };
    }

    this.state.recordEvent(event);
    this.onEvent?.(event);
    this.mozaik.sendEvent(
      SemanticEvent.create(event.type, this.gateway.getId(), event),
      this.gateway.getId(),
    );

    return {
      accepted: true,
      duplicate: false,
      eventId: event.id,
      handlerCount: this.handlerCounts.get(event.type) ?? 0,
    };
  }

  runAgent(
    agentId: string,
    event: ChargebackSemanticEvent,
    options: AgentLoopOptions = {},
  ): void {
    const agent = this.getAgent(agentId);
    const definition = this.definitions.get(agentId);
    if (!definition) {
      throw new Error(`Chargeback agent definition is not registered: ${agentId}`);
    }

    const inferenceInput: InferenceInput = {
      model: definition.model,
      context: agent.getMemory().getContext(),
      tools: agent.getTools(),
      ...options.inferenceInput,
    };
    const message =
      options.message ??
      `Process ${event.type} for dispute entity ${event.entityId}. Event payload: ${JSON.stringify(event.payload)}`;

    this.mozaik.runLoop(
      agent.getId(),
      message,
      inferenceInput,
      options.interceptionHandler,
    );
  }

  getMozaikRuntime(): ReturnType<ReturnType<typeof defineRuntime<ChargebackRuntimeState>>["resolveRuntime"]> {
    return this.mozaik.resolveRuntime();
  }

  getMozaikParticipant(agentId: string): Agent {
    return this.getAgent(agentId);
  }
}

