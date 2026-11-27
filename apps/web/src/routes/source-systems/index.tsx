import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useSourceSystemsQuery, useSourceSystemsRecordQuery } from "@/hooks/query/use-source-systems-query";

export function SourceSystemsPage() {
  const [offset, setOffset] = useState(0);
  const query = useSourceSystemsQuery(50, offset);
  return <SyntheticCollectionPage title="Source Systems" path="source-systems" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function SourceSystemsRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useSourceSystemsRecordQuery(recordId);
  return <SyntheticRecordPage title="Source Systems" path="source-systems" recordId={recordId} query={query} />;
}
