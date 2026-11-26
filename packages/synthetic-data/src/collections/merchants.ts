import type { Merchant } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class MerchantsCollection extends SyntheticCollection<Merchant> { constructor(input: CollectionInput<Merchant> = []) { super(input, "merchants"); } }
