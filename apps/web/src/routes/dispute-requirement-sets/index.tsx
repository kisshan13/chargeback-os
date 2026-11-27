import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useDisputeRequirementSetsQuery, useDisputeRequirementSetsRecordQuery } from "@/hooks/query/use-dispute-requirement-sets-query";

export function DisputeRequirementSetsPage() {
  const [offset, setOffset] = useState(0);
  const query = useDisputeRequirementSetsQuery(50, offset);
  return <SyntheticCollectionPage title="Dispute Requirement Sets" path="dispute-requirement-sets" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function DisputeRequirementSetsRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useDisputeRequirementSetsRecordQuery(recordId);
  return <SyntheticRecordPage title="Dispute Requirement Sets" path="dispute-requirement-sets" recordId={recordId} query={query} />;
}
