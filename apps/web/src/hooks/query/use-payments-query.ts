import { useQuery } from "@tanstack/react-query";
import { getPaymentOverview, getPayments, getPaymentsRecord } from "@/core-api/payments.api";

export function usePaymentsQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["payments", limit, offset], queryFn: () => getPayments(limit, offset) });
}

export function usePaymentsRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["payments-record", recordId], queryFn: () => getPaymentsRecord(recordId), enabled: Boolean(recordId) });
}

export function usePaymentOverviewQuery(recordId: string) {
  return useQuery({ queryKey: ["payment-overview", recordId], queryFn: () => getPaymentOverview(recordId), enabled: Boolean(recordId) });
}
