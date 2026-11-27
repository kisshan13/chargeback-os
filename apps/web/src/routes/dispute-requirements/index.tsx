import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useDisputeRequirementsQuery, useDisputeRequirementsRecordQuery } from "@/hooks/query/use-dispute-requirements-query";

export function DisputeRequirementsPage() {
  const [offset, setOffset] = useState(0);
  const query = useDisputeRequirementsQuery(50, offset);
  return <SyntheticCollectionPage title="Dispute Requirements" path="dispute-requirements" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function DisputeRequirementsRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useDisputeRequirementsRecordQuery(recordId);
  return <SyntheticRecordPage title="Dispute Requirements" path="dispute-requirements" recordId={recordId} query={query} />;
}
