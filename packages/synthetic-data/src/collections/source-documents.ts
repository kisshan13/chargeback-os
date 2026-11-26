import type { SourceDocument } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class SourceDocumentsCollection extends SyntheticCollection<SourceDocument> { constructor(input: CollectionInput<SourceDocument> = []) { super(input, "source_documents"); } }
