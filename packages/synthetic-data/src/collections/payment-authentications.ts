import type { PaymentAuthentication } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class PaymentAuthenticationsCollection extends SyntheticCollection<PaymentAuthentication> {
  constructor(input: CollectionInput<PaymentAuthentication> = []) { super(input, "payment_authentications"); }
  forPayment(paymentId: string): PaymentAuthentication[] { return this.findMany({ where: { paymentId } }); }
}
