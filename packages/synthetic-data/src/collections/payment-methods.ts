import type { PaymentMethod } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class PaymentMethodsCollection extends SyntheticCollection<PaymentMethod> {
  constructor(input: CollectionInput<PaymentMethod> = []) { super(input, "payment_methods"); }
  forCustomer(customerId: string): PaymentMethod[] { return this.findMany({ where: { customerId } }); }
}
