import type { Transaction } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class TransactionsCollection extends SyntheticCollection<Transaction> {
  constructor(input: CollectionInput<Transaction> = []) { super(input, "transactions"); }
  forPayment(paymentId: string): Transaction[] { return this.findMany({ where: { paymentId }, orderBy: { field: "occurredAt", direction: "asc" } }); }
  successfulCaptures(): Transaction[] { return this.findMany({ where: { type: "CAPTURE", status: "SUCCEEDED" } }); }
}
