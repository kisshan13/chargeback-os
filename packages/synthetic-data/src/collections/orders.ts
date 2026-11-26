import type { Order } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class OrdersCollection extends SyntheticCollection<Order> {
  constructor(input: CollectionInput<Order> = []) { super(input, "orders"); }
  forCustomer(customerId: string): Order[] { return this.findMany({ where: { customerId } }); }
  forMerchant(merchantId: string): Order[] { return this.findMany({ where: { merchantId } }); }
  withStatus(status: Order["status"]): Order[] { return this.findMany({ where: { status } }); }
}
