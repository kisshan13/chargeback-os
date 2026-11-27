import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useShipmentEventsQuery, useShipmentEventsRecordQuery } from "@/hooks/query/use-shipment-events-query";

export function ShipmentEventsPage() {
  const [offset, setOffset] = useState(0);
  const query = useShipmentEventsQuery(50, offset);
  return <SyntheticCollectionPage title="Shipment Events" path="shipment-events" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function ShipmentEventsRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useShipmentEventsRecordQuery(recordId);
  return <SyntheticRecordPage title="Shipment Events" path="shipment-events" recordId={recordId} query={query} />;
}
