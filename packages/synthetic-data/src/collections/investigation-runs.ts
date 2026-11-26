import type { InvestigationRun } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class InvestigationRunsCollection extends SyntheticCollection<InvestigationRun> { constructor(input: CollectionInput<InvestigationRun> = []) { super(input, "investigation_runs"); } }
