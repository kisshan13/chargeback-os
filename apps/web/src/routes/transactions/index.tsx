import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useTransactionsQuery, useTransactionsRecordQuery } from "@/hooks/query/use-transactions-query";

export function TransactionsPage() {
  const [offset, setOffset] = useState(0);
  const query = useTransactionsQuery(50, offset);
  return <SyntheticCollectionPage title="Transactions" path="transactions" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function TransactionsRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useTransactionsRecordQuery(recordId);
  return <SyntheticRecordPage title="Transactions" path="transactions" recordId={recordId} query={query} />;
}
