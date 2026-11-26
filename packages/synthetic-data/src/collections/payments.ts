import type { Payment } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class PaymentsCollection extends SyntheticCollection<Payment> {
  constructor(input: CollectionInput<Payment> = []) { super(input, "payments"); }
  forOrder(orderId: string): Payment[] { return this.findMany({ where: { orderId } }); }
  forCustomer(customerId: string): Payment[] { return this.findMany({ where: { customerId } }); }
  withStatus(status: Payment["status"]): Payment[] { return this.findMany({ where: { status } }); }
}
