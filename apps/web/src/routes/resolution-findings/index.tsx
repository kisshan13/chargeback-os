import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useResolutionFindingsQuery, useResolutionFindingsRecordQuery } from "@/hooks/query/use-resolution-findings-query";

export function ResolutionFindingsPage() {
  const [offset, setOffset] = useState(0);
  const query = useResolutionFindingsQuery(50, offset);
  return <SyntheticCollectionPage title="Resolution Findings" path="resolution-findings" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function ResolutionFindingsRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useResolutionFindingsRecordQuery(recordId);
  return <SyntheticRecordPage title="Resolution Findings" path="resolution-findings" recordId={recordId} query={query} />;
}
