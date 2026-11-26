import type { RefundTransaction } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class RefundTransactionsCollection extends SyntheticCollection<RefundTransaction> {
  constructor(input: CollectionInput<RefundTransaction> = []) { super(input, "refund_transactions"); }
  forRefund(refundId: string): RefundTransaction[] { return this.findMany({ where: { refundId } }); }
}
