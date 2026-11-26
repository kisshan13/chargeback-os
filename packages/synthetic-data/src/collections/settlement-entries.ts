import type { SettlementEntry } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class SettlementEntriesCollection extends SyntheticCollection<SettlementEntry> { constructor(input: CollectionInput<SettlementEntry> = []) { super(input, "settlement_entries"); } }
