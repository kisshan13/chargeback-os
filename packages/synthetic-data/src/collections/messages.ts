import type { Message } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class MessagesCollection extends SyntheticCollection<Message> {
  constructor(input: CollectionInput<Message> = []) { super(input, "messages"); }
  forConversation(conversationId: string): Message[] { return this.findMany({ where: { conversationId }, orderBy: { field: "sentAt", direction: "asc" } }); }
}
