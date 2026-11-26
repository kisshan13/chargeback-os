import type { Address } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class AddressesCollection extends SyntheticCollection<Address> { constructor(input: CollectionInput<Address> = []) { super(input, "addresses"); } }
