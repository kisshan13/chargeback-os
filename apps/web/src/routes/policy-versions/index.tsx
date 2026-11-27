import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { usePolicyVersionsQuery, usePolicyVersionsRecordQuery } from "@/hooks/query/use-policy-versions-query";

export function PolicyVersionsPage() {
  const [offset, setOffset] = useState(0);
  const query = usePolicyVersionsQuery(50, offset);
  return <SyntheticCollectionPage title="Policy Versions" path="policy-versions" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function PolicyVersionsRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = usePolicyVersionsRecordQuery(recordId);
  return <SyntheticRecordPage title="Policy Versions" path="policy-versions" recordId={recordId} query={query} />;
}
