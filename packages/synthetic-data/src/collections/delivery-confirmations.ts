import type { DeliveryConfirmation } from "../schema.js";
import { CollectionInput, SyntheticCollection } from "./base.js";
export class DeliveryConfirmationsCollection extends SyntheticCollection<DeliveryConfirmation> {
  constructor(input: CollectionInput<DeliveryConfirmation> = []) { super(input, "delivery_confirmations"); }
  forShipment(shipmentId: string): DeliveryConfirmation[] { return this.findMany({ where: { shipmentId } }); }
}
