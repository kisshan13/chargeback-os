import type { SourceSystem } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class SourceSystemsCollection extends SyntheticCollection<SourceSystem> { constructor(input: CollectionInput<SourceSystem> = []) { super(input, "source_systems"); } }
