import type { DisputeItem } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class DisputeItemsCollection extends SyntheticCollection<DisputeItem> { constructor(input: CollectionInput<DisputeItem> = []) { super(input, "dispute_items"); } }
