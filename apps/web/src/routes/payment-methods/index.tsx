import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { usePaymentMethodsQuery, usePaymentMethodsRecordQuery } from "@/hooks/query/use-payment-methods-query";

export function PaymentMethodsPage() {
  const [offset, setOffset] = useState(0);
  const query = usePaymentMethodsQuery(50, offset);
  return <SyntheticCollectionPage title="Payment Methods" path="payment-methods" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function PaymentMethodsRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = usePaymentMethodsRecordQuery(recordId);
  return <SyntheticRecordPage title="Payment Methods" path="payment-methods" recordId={recordId} query={query} />;
}
