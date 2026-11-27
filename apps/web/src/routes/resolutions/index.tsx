import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useResolutionsQuery, useResolutionsRecordQuery } from "@/hooks/query/use-resolutions-query";

export function ResolutionsPage() {
  const [offset, setOffset] = useState(0);
  const query = useResolutionsQuery(50, offset);
  return <SyntheticCollectionPage title="Resolutions" path="resolutions" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function ResolutionsRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useResolutionsRecordQuery(recordId);
  return <SyntheticRecordPage title="Resolutions" path="resolutions" recordId={recordId} query={query} />;
}
