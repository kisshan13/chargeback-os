import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useRefundTransactionsQuery, useRefundTransactionsRecordQuery } from "@/hooks/query/use-refund-transactions-query";

export function RefundTransactionsPage() {
  const [offset, setOffset] = useState(0);
  const query = useRefundTransactionsQuery(50, offset);
  return <SyntheticCollectionPage title="Refund Transactions" path="refund-transactions" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function RefundTransactionsRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useRefundTransactionsRecordQuery(recordId);
  return <SyntheticRecordPage title="Refund Transactions" path="refund-transactions" recordId={recordId} query={query} />;
}
