import type { ShipmentItem } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class ShipmentItemsCollection extends SyntheticCollection<ShipmentItem> {
  constructor(input: CollectionInput<ShipmentItem> = []) { super(input, "shipment_items"); }
  forShipment(shipmentId: string): ShipmentItem[] { return this.findMany({ where: { shipmentId } }); }
  forOrderItem(orderItemId: string): ShipmentItem[] { return this.findMany({ where: { orderItemId } }); }
}
