import type { PolicyClause } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class PolicyClausesCollection extends SyntheticCollection<PolicyClause> { constructor(input: CollectionInput<PolicyClause> = []) { super(input, "policy_clauses"); } }
