import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { usePaymentAuthenticationsQuery, usePaymentAuthenticationsRecordQuery } from "@/hooks/query/use-payment-authentications-query";

export function PaymentAuthenticationsPage() {
  const [offset, setOffset] = useState(0);
  const query = usePaymentAuthenticationsQuery(50, offset);
  return <SyntheticCollectionPage title="Payment Authentications" path="payment-authentications" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function PaymentAuthenticationsRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = usePaymentAuthenticationsRecordQuery(recordId);
  return <SyntheticRecordPage title="Payment Authentications" path="payment-authentications" recordId={recordId} query={query} />;
}
