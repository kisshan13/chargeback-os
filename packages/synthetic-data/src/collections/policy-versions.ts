import type { PolicyVersion } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class PolicyVersionsCollection extends SyntheticCollection<PolicyVersion> {
  constructor(input: CollectionInput<PolicyVersion> = []) { super(input, "policy_versions"); }
  forPolicy(policyId: string): PolicyVersion[] { return this.findMany({ where: { policyId }, orderBy: { field: "version", direction: "asc" } }); }
}
