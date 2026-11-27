import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useEvidenceSourceReferencesQuery, useEvidenceSourceReferencesRecordQuery } from "@/hooks/query/use-evidence-source-references-query";

export function EvidenceSourceReferencesPage() {
  const [offset, setOffset] = useState(0);
  const query = useEvidenceSourceReferencesQuery(50, offset);
  return <SyntheticCollectionPage title="Evidence Source References" path="evidence-source-references" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function EvidenceSourceReferencesRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useEvidenceSourceReferencesRecordQuery(recordId);
  return <SyntheticRecordPage title="Evidence Source References" path="evidence-source-references" recordId={recordId} query={query} />;
}
