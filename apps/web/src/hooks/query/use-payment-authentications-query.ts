import { useQuery } from "@tanstack/react-query";
import { getPaymentAuthentications, getPaymentAuthenticationsRecord } from "@/core-api/payment-authentications.api";

export function usePaymentAuthenticationsQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["payment-authentications", limit, offset], queryFn: () => getPaymentAuthentications(limit, offset) });
}

export function usePaymentAuthenticationsRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["payment-authentications-record", recordId], queryFn: () => getPaymentAuthenticationsRecord(recordId), enabled: Boolean(recordId) });
}
