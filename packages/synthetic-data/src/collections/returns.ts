import type { Return } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class ReturnsCollection extends SyntheticCollection<Return> { constructor(input: CollectionInput<Return> = []) { super(input, "returns"); } }
