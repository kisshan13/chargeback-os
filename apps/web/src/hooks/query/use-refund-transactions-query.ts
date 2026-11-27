import { useQuery } from "@tanstack/react-query";
import { getRefundTransactions, getRefundTransactionsRecord } from "@/core-api/refund-transactions.api";

export function useRefundTransactionsQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["refund-transactions", limit, offset], queryFn: () => getRefundTransactions(limit, offset) });
}

export function useRefundTransactionsRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["refund-transactions-record", recordId], queryFn: () => getRefundTransactionsRecord(recordId), enabled: Boolean(recordId) });
}
