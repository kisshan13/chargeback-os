import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useShipmentItemsQuery, useShipmentItemsRecordQuery } from "@/hooks/query/use-shipment-items-query";

export function ShipmentItemsPage() {
  const [offset, setOffset] = useState(0);
  const query = useShipmentItemsQuery(50, offset);
  return <SyntheticCollectionPage title="Shipment Items" path="shipment-items" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function ShipmentItemsRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useShipmentItemsRecordQuery(recordId);
  return <SyntheticRecordPage title="Shipment Items" path="shipment-items" recordId={recordId} query={query} />;
}
