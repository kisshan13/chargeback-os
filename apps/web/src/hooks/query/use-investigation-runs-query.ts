import { useQuery } from "@tanstack/react-query";
import { getInvestigationRuns, getInvestigationRunsRecord } from "@/core-api/investigation-runs.api";

export function useInvestigationRunsQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["investigation-runs", limit, offset], queryFn: () => getInvestigationRuns(limit, offset) });
}

export function useInvestigationRunsRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["investigation-runs-record", recordId], queryFn: () => getInvestigationRunsRecord(recordId), enabled: Boolean(recordId) });
}
