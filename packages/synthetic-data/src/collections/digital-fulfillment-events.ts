import type { DigitalFulfillmentEvent } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class DigitalFulfillmentEventsCollection extends SyntheticCollection<DigitalFulfillmentEvent> { constructor(input: CollectionInput<DigitalFulfillmentEvent> = []) { super(input, "digital_fulfillment_events"); } }
