import type { ResolutionFinding } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class ResolutionFindingsCollection extends SyntheticCollection<ResolutionFinding> { constructor(input: CollectionInput<ResolutionFinding> = []) { super(input, "resolution_findings"); } }
