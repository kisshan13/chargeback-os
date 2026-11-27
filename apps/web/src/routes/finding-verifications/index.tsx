import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useFindingVerificationsQuery, useFindingVerificationsRecordQuery } from "@/hooks/query/use-finding-verifications-query";

export function FindingVerificationsPage() {
  const [offset, setOffset] = useState(0);
  const query = useFindingVerificationsQuery(50, offset);
  return <SyntheticCollectionPage title="Finding Verifications" path="finding-verifications" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function FindingVerificationsRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useFindingVerificationsRecordQuery(recordId);
  return <SyntheticRecordPage title="Finding Verifications" path="finding-verifications" recordId={recordId} query={query} />;
}
