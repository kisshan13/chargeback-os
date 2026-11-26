import type { DisputeReasonCode } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class DisputeReasonCodesCollection extends SyntheticCollection<DisputeReasonCode> { constructor(input: CollectionInput<DisputeReasonCode> = []) { super(input, "dispute_reason_codes"); } }
