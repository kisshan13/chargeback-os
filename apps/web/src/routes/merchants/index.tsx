import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useMerchantsQuery, useMerchantsRecordQuery } from "@/hooks/query/use-merchants-query";

export function MerchantsPage() {
  const [offset, setOffset] = useState(0);
  const query = useMerchantsQuery(50, offset);
  return <SyntheticCollectionPage title="Merchants" path="merchants" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function MerchantsRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useMerchantsRecordQuery(recordId);
  return <SyntheticRecordPage title="Merchants" path="merchants" recordId={recordId} query={query} />;
}
