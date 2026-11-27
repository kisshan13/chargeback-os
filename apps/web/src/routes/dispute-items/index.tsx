import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useDisputeItemsQuery, useDisputeItemsRecordQuery } from "@/hooks/query/use-dispute-items-query";

export function DisputeItemsPage() {
  const [offset, setOffset] = useState(0);
  const query = useDisputeItemsQuery(50, offset);
  return <SyntheticCollectionPage title="Dispute Items" path="dispute-items" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function DisputeItemsRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useDisputeItemsRecordQuery(recordId);
  return <SyntheticRecordPage title="Dispute Items" path="dispute-items" recordId={recordId} query={query} />;
}
