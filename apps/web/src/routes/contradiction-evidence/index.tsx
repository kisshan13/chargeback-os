import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useContradictionEvidenceQuery, useContradictionEvidenceRecordQuery } from "@/hooks/query/use-contradiction-evidence-query";

export function ContradictionEvidencePage() {
  const [offset, setOffset] = useState(0);
  const query = useContradictionEvidenceQuery(50, offset);
  return <SyntheticCollectionPage title="Contradiction Evidence" path="contradiction-evidence" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function ContradictionEvidenceRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useContradictionEvidenceRecordQuery(recordId);
  return <SyntheticRecordPage title="Contradiction Evidence" path="contradiction-evidence" recordId={recordId} query={query} />;
}
