import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useDisputeReasonCodesQuery, useDisputeReasonCodesRecordQuery } from "@/hooks/query/use-dispute-reason-codes-query";

export function DisputeReasonCodesPage() {
  const [offset, setOffset] = useState(0);
  const query = useDisputeReasonCodesQuery(50, offset);
  return <SyntheticCollectionPage title="Dispute Reason Codes" path="dispute-reason-codes" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function DisputeReasonCodesRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useDisputeReasonCodesRecordQuery(recordId);
  return <SyntheticRecordPage title="Dispute Reason Codes" path="dispute-reason-codes" recordId={recordId} query={query} />;
}
