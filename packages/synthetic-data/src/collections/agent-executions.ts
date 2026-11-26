import type { AgentExecution } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class AgentExecutionsCollection extends SyntheticCollection<AgentExecution> { constructor(input: CollectionInput<AgentExecution> = []) { super(input, "agent_executions"); } }
