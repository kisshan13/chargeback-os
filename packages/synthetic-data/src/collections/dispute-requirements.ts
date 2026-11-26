import type { DisputeRequirement } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class DisputeRequirementsCollection extends SyntheticCollection<DisputeRequirement> { constructor(input: CollectionInput<DisputeRequirement> = []) { super(input, "dispute_requirements"); } }
