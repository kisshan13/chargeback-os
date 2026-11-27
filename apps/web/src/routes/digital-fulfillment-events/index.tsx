import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useDigitalFulfillmentEventsQuery, useDigitalFulfillmentEventsRecordQuery } from "@/hooks/query/use-digital-fulfillment-events-query";

export function DigitalFulfillmentEventsPage() {
  const [offset, setOffset] = useState(0);
  const query = useDigitalFulfillmentEventsQuery(50, offset);
  return <SyntheticCollectionPage title="Digital Fulfillment Events" path="digital-fulfillment-events" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function DigitalFulfillmentEventsRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useDigitalFulfillmentEventsRecordQuery(recordId);
  return <SyntheticRecordPage title="Digital Fulfillment Events" path="digital-fulfillment-events" recordId={recordId} query={query} />;
}
