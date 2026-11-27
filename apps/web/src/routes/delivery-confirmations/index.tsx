import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useDeliveryConfirmationsQuery, useDeliveryConfirmationsRecordQuery } from "@/hooks/query/use-delivery-confirmations-query";

export function DeliveryConfirmationsPage() {
  const [offset, setOffset] = useState(0);
  const query = useDeliveryConfirmationsQuery(50, offset);
  return <SyntheticCollectionPage title="Delivery Confirmations" path="delivery-confirmations" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function DeliveryConfirmationsRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useDeliveryConfirmationsRecordQuery(recordId);
  return <SyntheticRecordPage title="Delivery Confirmations" path="delivery-confirmations" recordId={recordId} query={query} />;
}
