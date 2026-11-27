import { useQuery } from "@tanstack/react-query";
import { getPaymentMethods, getPaymentMethodsRecord } from "@/core-api/payment-methods.api";

export function usePaymentMethodsQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["payment-methods", limit, offset], queryFn: () => getPaymentMethods(limit, offset) });
}

export function usePaymentMethodsRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["payment-methods-record", recordId], queryFn: () => getPaymentMethodsRecord(recordId), enabled: Boolean(recordId) });
}
