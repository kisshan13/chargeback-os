import type { EvidenceSourceReference } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class EvidenceSourceReferencesCollection extends SyntheticCollection<EvidenceSourceReference> { constructor(input: CollectionInput<EvidenceSourceReference> = []) { super(input, "evidence_source_references"); } }
