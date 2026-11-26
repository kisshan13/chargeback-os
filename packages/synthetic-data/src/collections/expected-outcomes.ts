import type { ExpectedOutcome } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class ExpectedOutcomesCollection extends SyntheticCollection<ExpectedOutcome> { constructor(input: CollectionInput<ExpectedOutcome> = []) { super(input, "expected_outcomes"); } }
