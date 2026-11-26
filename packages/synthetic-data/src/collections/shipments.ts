import type { Shipment } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class ShipmentsCollection extends SyntheticCollection<Shipment> {
  constructor(input: CollectionInput<Shipment> = []) { super(input, "shipments"); }
  forOrder(orderId: string): Shipment[] { return this.findMany({ where: { orderId } }); }
  withStatus(status: Shipment["status"]): Shipment[] { return this.findMany({ where: { status } }); }
}
