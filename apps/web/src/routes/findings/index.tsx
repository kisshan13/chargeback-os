import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useFindingsQuery, useFindingsRecordQuery } from "@/hooks/query/use-findings-query";

export function FindingsPage() {
  const [offset, setOffset] = useState(0);
  const query = useFindingsQuery(50, offset);
  return <SyntheticCollectionPage title="Findings" path="findings" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function FindingsRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useFindingsRecordQuery(recordId);
  return <SyntheticRecordPage title="Findings" path="findings" recordId={recordId} query={query} />;
}
