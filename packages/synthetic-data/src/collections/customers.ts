import type { Customer } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class CustomersCollection extends SyntheticCollection<Customer> { constructor(input: CollectionInput<Customer> = []) { super(input, "customers"); } }
