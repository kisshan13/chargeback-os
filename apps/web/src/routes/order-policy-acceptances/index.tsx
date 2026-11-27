import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useOrderPolicyAcceptancesQuery, useOrderPolicyAcceptancesRecordQuery } from "@/hooks/query/use-order-policy-acceptances-query";

export function OrderPolicyAcceptancesPage() {
  const [offset, setOffset] = useState(0);
  const query = useOrderPolicyAcceptancesQuery(50, offset);
  return <SyntheticCollectionPage title="Order Policy Acceptances" path="order-policy-acceptances" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function OrderPolicyAcceptancesRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useOrderPolicyAcceptancesRecordQuery(recordId);
  return <SyntheticRecordPage title="Order Policy Acceptances" path="order-policy-acceptances" recordId={recordId} query={query} />;
}
