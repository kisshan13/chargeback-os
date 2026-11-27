import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useEvidenceQuery, useEvidenceRecordQuery } from "@/hooks/query/use-evidence-query";

export function EvidencePage() {
  const [offset, setOffset] = useState(0);
  const query = useEvidenceQuery(50, offset);
  return <SyntheticCollectionPage title="Evidence" path="evidence" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function EvidenceRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useEvidenceRecordQuery(recordId);
  return <SyntheticRecordPage title="Evidence" path="evidence" recordId={recordId} query={query} />;
}
