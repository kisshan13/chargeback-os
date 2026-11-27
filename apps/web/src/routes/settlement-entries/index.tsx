import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useSettlementEntriesQuery, useSettlementEntriesRecordQuery } from "@/hooks/query/use-settlement-entries-query";

export function SettlementEntriesPage() {
  const [offset, setOffset] = useState(0);
  const query = useSettlementEntriesQuery(50, offset);
  return <SyntheticCollectionPage title="Settlement Entries" path="settlement-entries" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function SettlementEntriesRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useSettlementEntriesRecordQuery(recordId);
  return <SyntheticRecordPage title="Settlement Entries" path="settlement-entries" recordId={recordId} query={query} />;
}
