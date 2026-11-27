import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useReturnItemsQuery, useReturnItemsRecordQuery } from "@/hooks/query/use-return-items-query";

export function ReturnItemsPage() {
  const [offset, setOffset] = useState(0);
  const query = useReturnItemsQuery(50, offset);
  return <SyntheticCollectionPage title="Return Items" path="return-items" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function ReturnItemsRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useReturnItemsRecordQuery(recordId);
  return <SyntheticRecordPage title="Return Items" path="return-items" recordId={recordId} query={query} />;
}
