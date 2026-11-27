import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useExpectedOutcomesQuery, useExpectedOutcomesRecordQuery } from "@/hooks/query/use-expected-outcomes-query";

export function ExpectedOutcomesPage() {
  const [offset, setOffset] = useState(0);
  const query = useExpectedOutcomesQuery(50, offset);
  return <SyntheticCollectionPage title="Expected Outcomes" path="expected-outcomes" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function ExpectedOutcomesRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useExpectedOutcomesRecordQuery(recordId);
  return <SyntheticRecordPage title="Expected Outcomes" path="expected-outcomes" recordId={recordId} query={query} />;
}
