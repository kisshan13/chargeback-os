import type { Evidence } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class EvidenceCollection extends SyntheticCollection<Evidence> { constructor(input: CollectionInput<Evidence> = []) { super(input, "evidence"); } }
