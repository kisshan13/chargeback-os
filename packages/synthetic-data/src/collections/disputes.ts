import type { Dispute } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class DisputesCollection extends SyntheticCollection<Dispute> {
  constructor(input: CollectionInput<Dispute> = []) { super(input, "disputes"); }
  forPayment(paymentId: string): Dispute[] { return this.findMany({ where: { paymentId } }); }
  withStatus(status: Dispute["providerStatus"]): Dispute[] { return this.findMany({ where: { providerStatus: status } }); }
}
