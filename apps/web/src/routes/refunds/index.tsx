import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useRefundsQuery, useRefundsRecordQuery } from "@/hooks/query/use-refunds-query";

export function RefundsPage() {
  const [offset, setOffset] = useState(0);
  const query = useRefundsQuery(50, offset);
  return <SyntheticCollectionPage title="Refunds" path="refunds" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function RefundsRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useRefundsRecordQuery(recordId);
  return <SyntheticRecordPage title="Refunds" path="refunds" recordId={recordId} query={query} />;
}
