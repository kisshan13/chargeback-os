import type { EvidenceRequest } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class EvidenceRequestsCollection extends SyntheticCollection<EvidenceRequest> { constructor(input: CollectionInput<EvidenceRequest> = []) { super(input, "evidence_requests"); } }
