import type { Conversation } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class ConversationsCollection extends SyntheticCollection<Conversation> {
  constructor(input: CollectionInput<Conversation> = []) { super(input, "conversations"); }
  forOrder(orderId: string): Conversation[] { return this.findMany({ where: { orderId } }); }
  forCustomer(customerId: string): Conversation[] { return this.findMany({ where: { customerId } }); }
}
