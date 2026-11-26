import type { Resolution } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class ResolutionsCollection extends SyntheticCollection<Resolution> { constructor(input: CollectionInput<Resolution> = []) { super(input, "resolutions"); } }
