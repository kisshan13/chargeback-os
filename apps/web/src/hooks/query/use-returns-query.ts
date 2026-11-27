import { useQuery } from "@tanstack/react-query";
import { getReturns, getReturnsRecord } from "@/core-api/returns.api";

export function useReturnsQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["returns", limit, offset], queryFn: () => getReturns(limit, offset) });
}

export function useReturnsRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["returns-record", recordId], queryFn: () => getReturnsRecord(recordId), enabled: Boolean(recordId) });
}
