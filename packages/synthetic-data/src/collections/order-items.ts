import type { OrderItem } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class OrderItemsCollection extends SyntheticCollection<OrderItem> {
  constructor(input: CollectionInput<OrderItem> = []) { super(input, "order_items"); }
  forOrder(orderId: string): OrderItem[] { return this.findMany({ where: { orderId } }); }
  forProduct(productId: string): OrderItem[] { return this.findMany({ where: { productId } }); }
}
