import { useQuery } from "@tanstack/react-query";
import { getRefunds, getRefundsRecord } from "@/core-api/refunds.api";

export function useRefundsQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["refunds", limit, offset], queryFn: () => getRefunds(limit, offset) });
}

export function useRefundsRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["refunds-record", recordId], queryFn: () => getRefundsRecord(recordId), enabled: Boolean(recordId) });
}
