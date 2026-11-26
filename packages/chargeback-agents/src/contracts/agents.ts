import type { Agent, InferenceInput, InterceptionHandler, Tool } from "@mozaik-ai/core";

export type AgentRole =
  | "coordinator"
  | "financial"
  | "fulfillment"
  | "customer-policy"
  | "contradiction"
  | "resolution"
  | (string & {});

export interface ChargebackAgentDefinition {
  readonly id: string;
  readonly name: string;
  readonly role: AgentRole;
  readonly capabilities?: readonly string[];
  readonly instruction: string;
  readonly model: string;
  readonly tools?: readonly Tool[];
}

export interface AgentLoopOptions {
  readonly message?: string;
  readonly inferenceInput?: Partial<InferenceInput>;
  readonly interceptionHandler?: InterceptionHandler;
}

export type RegisteredChargebackAgent = Agent;

