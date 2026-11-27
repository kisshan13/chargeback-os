import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useShipmentsQuery, useShipmentsRecordQuery } from "@/hooks/query/use-shipments-query";

export function ShipmentsPage() {
  const [offset, setOffset] = useState(0);
  const query = useShipmentsQuery(50, offset);
  return <SyntheticCollectionPage title="Shipments" path="shipments" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function ShipmentsRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useShipmentsRecordQuery(recordId);
  return <SyntheticRecordPage title="Shipments" path="shipments" recordId={recordId} query={query} />;
}
