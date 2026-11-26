import type { MessageAttachment } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class MessageAttachmentsCollection extends SyntheticCollection<MessageAttachment> { constructor(input: CollectionInput<MessageAttachment> = []) { super(input, "message_attachments"); } }
