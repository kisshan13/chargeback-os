import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useOrderItemsQuery, useOrderItemsRecordQuery } from "@/hooks/query/use-order-items-query";

export function OrderItemsPage() {
  const [offset, setOffset] = useState(0);
  const query = useOrderItemsQuery(50, offset);
  return <SyntheticCollectionPage title="Order Items" path="order-items" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function OrderItemsRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useOrderItemsRecordQuery(recordId);
  return <SyntheticRecordPage title="Order Items" path="order-items" recordId={recordId} query={query} />;
}
