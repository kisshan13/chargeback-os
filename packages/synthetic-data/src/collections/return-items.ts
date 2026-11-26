import type { ReturnItem } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class ReturnItemsCollection extends SyntheticCollection<ReturnItem> { constructor(input: CollectionInput<ReturnItem> = []) { super(input, "return_items"); } }
