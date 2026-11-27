import { useQuery } from "@tanstack/react-query";
import { getFindings, getFindingsRecord } from "@/core-api/findings.api";

export function useFindingsQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["findings", limit, offset], queryFn: () => getFindings(limit, offset) });
}

export function useFindingsRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["findings-record", recordId], queryFn: () => getFindingsRecord(recordId), enabled: Boolean(recordId) });
}
