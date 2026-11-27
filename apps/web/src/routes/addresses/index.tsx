import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useAddressesQuery, useAddressesRecordQuery } from "@/hooks/query/use-addresses-query";

export function AddressesPage() {
  const [offset, setOffset] = useState(0);
  const query = useAddressesQuery(50, offset);
  return <SyntheticCollectionPage title="Addresses" path="addresses" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function AddressesRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useAddressesRecordQuery(recordId);
  return <SyntheticRecordPage title="Addresses" path="addresses" recordId={recordId} query={query} />;
}
