import { useQuery } from "@tanstack/react-query";
import { getTransactions, getTransactionsRecord } from "@/core-api/transactions.api";

export function useTransactionsQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["transactions", limit, offset], queryFn: () => getTransactions(limit, offset) });
}

export function useTransactionsRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["transactions-record", recordId], queryFn: () => getTransactionsRecord(recordId), enabled: Boolean(recordId) });
}
