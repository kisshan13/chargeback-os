import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useFindingEvidenceQuery, useFindingEvidenceRecordQuery } from "@/hooks/query/use-finding-evidence-query";

export function FindingEvidencePage() {
  const [offset, setOffset] = useState(0);
  const query = useFindingEvidenceQuery(50, offset);
  return <SyntheticCollectionPage title="Finding Evidence" path="finding-evidence" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function FindingEvidenceRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useFindingEvidenceRecordQuery(recordId);
  return <SyntheticRecordPage title="Finding Evidence" path="finding-evidence" recordId={recordId} query={query} />;
}
