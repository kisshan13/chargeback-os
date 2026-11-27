import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useInvestigationRunsQuery, useInvestigationRunsRecordQuery } from "@/hooks/query/use-investigation-runs-query";

export function InvestigationRunsPage() {
  const [offset, setOffset] = useState(0);
  const query = useInvestigationRunsQuery(50, offset);
  return <SyntheticCollectionPage title="Investigation Runs" path="investigation-runs" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function InvestigationRunsRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useInvestigationRunsRecordQuery(recordId);
  return <SyntheticRecordPage title="Investigation Runs" path="investigation-runs" recordId={recordId} query={query} />;
}
