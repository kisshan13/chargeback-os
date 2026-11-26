import type { DisputeEvent } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class DisputeEventsCollection extends SyntheticCollection<DisputeEvent> {
  constructor(input: CollectionInput<DisputeEvent> = []) { super(input, "dispute_events"); }
  forDispute(disputeId: string): DisputeEvent[] { return this.findMany({ where: { disputeId }, orderBy: { field: "occurredAt", direction: "asc" } }); }
}
