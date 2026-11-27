import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useReturnsQuery, useReturnsRecordQuery } from "@/hooks/query/use-returns-query";

export function ReturnsPage() {
  const [offset, setOffset] = useState(0);
  const query = useReturnsQuery(50, offset);
  return <SyntheticCollectionPage title="Returns" path="returns" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function ReturnsRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useReturnsRecordQuery(recordId);
  return <SyntheticRecordPage title="Returns" path="returns" recordId={recordId} query={query} />;
}
