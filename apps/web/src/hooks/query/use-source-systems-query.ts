import { useQuery } from "@tanstack/react-query";
import { getSourceSystems, getSourceSystemsRecord } from "@/core-api/source-systems.api";

export function useSourceSystemsQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["source-systems", limit, offset], queryFn: () => getSourceSystems(limit, offset) });
}

export function useSourceSystemsRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["source-systems-record", recordId], queryFn: () => getSourceSystemsRecord(recordId), enabled: Boolean(recordId) });
}
