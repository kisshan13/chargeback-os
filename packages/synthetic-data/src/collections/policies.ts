import type { Policy } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class PoliciesCollection extends SyntheticCollection<Policy> { constructor(input: CollectionInput<Policy> = []) { super(input, "policies"); } }
