import type { ContradictionEvidence } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class ContradictionEvidenceCollection extends SyntheticCollection<ContradictionEvidence> { constructor(input: CollectionInput<ContradictionEvidence> = []) { super(input, "contradiction_evidence"); } }
