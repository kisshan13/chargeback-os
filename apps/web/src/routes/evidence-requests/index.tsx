import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useEvidenceRequestsQuery, useEvidenceRequestsRecordQuery } from "@/hooks/query/use-evidence-requests-query";

export function EvidenceRequestsPage() {
  const [offset, setOffset] = useState(0);
  const query = useEvidenceRequestsQuery(50, offset);
  return <SyntheticCollectionPage title="Evidence Requests" path="evidence-requests" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function EvidenceRequestsRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useEvidenceRequestsRecordQuery(recordId);
  return <SyntheticRecordPage title="Evidence Requests" path="evidence-requests" recordId={recordId} query={query} />;
}
