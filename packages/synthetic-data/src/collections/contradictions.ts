import type { Contradiction } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class ContradictionsCollection extends SyntheticCollection<Contradiction> { constructor(input: CollectionInput<Contradiction> = []) { super(input, "contradictions"); } }
