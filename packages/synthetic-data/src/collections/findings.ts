import type { Finding } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class FindingsCollection extends SyntheticCollection<Finding> { constructor(input: CollectionInput<Finding> = []) { super(input, "findings"); } }
