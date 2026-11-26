import type { DisputeRequirementSet } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class DisputeRequirementSetsCollection extends SyntheticCollection<DisputeRequirementSet> { constructor(input: CollectionInput<DisputeRequirementSet> = []) { super(input, "dispute_requirement_sets"); } }
