import { useQuery } from "@tanstack/react-query";
import { getContradictions, getContradictionsRecord } from "@/core-api/contradictions.api";

export function useContradictionsQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["contradictions", limit, offset], queryFn: () => getContradictions(limit, offset) });
}

export function useContradictionsRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["contradictions-record", recordId], queryFn: () => getContradictionsRecord(recordId), enabled: Boolean(recordId) });
}
