import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useDisputeEventsQuery, useDisputeEventsRecordQuery } from "@/hooks/query/use-dispute-events-query";

export function DisputeEventsPage() {
  const [offset, setOffset] = useState(0);
  const query = useDisputeEventsQuery(50, offset);
  return <SyntheticCollectionPage title="Dispute Events" path="dispute-events" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function DisputeEventsRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useDisputeEventsRecordQuery(recordId);
  return <SyntheticRecordPage title="Dispute Events" path="dispute-events" recordId={recordId} query={query} />;
}
