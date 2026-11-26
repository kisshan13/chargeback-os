import type { ProductPrice } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class ProductPricesCollection extends SyntheticCollection<ProductPrice> {
  constructor(input: CollectionInput<ProductPrice> = []) { super(input, "product_prices"); }
  forProduct(productId: string): ProductPrice[] { return this.findMany({ where: { productId } }); }
}
