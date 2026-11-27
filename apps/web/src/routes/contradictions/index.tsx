import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useContradictionsQuery, useContradictionsRecordQuery } from "@/hooks/query/use-contradictions-query";

export function ContradictionsPage() {
  const [offset, setOffset] = useState(0);
  const query = useContradictionsQuery(50, offset);
  return <SyntheticCollectionPage title="Contradictions" path="contradictions" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function ContradictionsRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useContradictionsRecordQuery(recordId);
  return <SyntheticRecordPage title="Contradictions" path="contradictions" recordId={recordId} query={query} />;
}
