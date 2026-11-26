import type { FindingVerification } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class FindingVerificationsCollection extends SyntheticCollection<FindingVerification> { constructor(input: CollectionInput<FindingVerification> = []) { super(input, "finding_verifications"); } }
