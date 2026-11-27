import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { usePolicyClausesQuery, usePolicyClausesRecordQuery } from "@/hooks/query/use-policy-clauses-query";

export function PolicyClausesPage() {
  const [offset, setOffset] = useState(0);
  const query = usePolicyClausesQuery(50, offset);
  return <SyntheticCollectionPage title="Policy Clauses" path="policy-clauses" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function PolicyClausesRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = usePolicyClausesRecordQuery(recordId);
  return <SyntheticRecordPage title="Policy Clauses" path="policy-clauses" recordId={recordId} query={query} />;
}
