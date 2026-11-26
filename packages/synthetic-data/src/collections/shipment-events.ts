import type { ShipmentEvent } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class ShipmentEventsCollection extends SyntheticCollection<ShipmentEvent> {
  constructor(input: CollectionInput<ShipmentEvent> = []) { super(input, "shipment_events"); }
  forShipment(shipmentId: string): ShipmentEvent[] { return this.findMany({ where: { shipmentId }, orderBy: { field: "occurredAt", direction: "asc" } }); }
}
