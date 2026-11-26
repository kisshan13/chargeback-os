import type { OrderPolicyAcceptance } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class OrderPolicyAcceptancesCollection extends SyntheticCollection<OrderPolicyAcceptance> {
  constructor(input: CollectionInput<OrderPolicyAcceptance> = []) { super(input, "order_policy_acceptances"); }
  forOrder(orderId: string): OrderPolicyAcceptance[] { return this.findMany({ where: { orderId } }); }
}
