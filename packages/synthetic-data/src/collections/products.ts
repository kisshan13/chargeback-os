import type { Product } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class ProductsCollection extends SyntheticCollection<Product> { constructor(input: CollectionInput<Product> = []) { super(input, "products"); } }
