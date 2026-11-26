import type { FindingEvidence } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class FindingEvidenceCollection extends SyntheticCollection<FindingEvidence> { constructor(input: CollectionInput<FindingEvidence> = []) { super(input, "finding_evidence"); } }
