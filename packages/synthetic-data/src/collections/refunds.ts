import type { Refund } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class RefundsCollection extends SyntheticCollection<Refund> {
  constructor(input: CollectionInput<Refund> = []) { super(input, "refunds"); }
  forPayment(paymentId: string): Refund[] { return this.findMany({ where: { paymentId } }); }
  withStatus(status: Refund["status"]): Refund[] { return this.findMany({ where: { status } }); }
}
