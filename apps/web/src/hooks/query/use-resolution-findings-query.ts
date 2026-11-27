import { useQuery } from "@tanstack/react-query";
import { getResolutionFindings, getResolutionFindingsRecord } from "@/core-api/resolution-findings.api";

export function useResolutionFindingsQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["resolution-findings", limit, offset], queryFn: () => getResolutionFindings(limit, offset) });
}

export function useResolutionFindingsRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["resolution-findings-record", recordId], queryFn: () => getResolutionFindingsRecord(recordId), enabled: Boolean(recordId) });
}
