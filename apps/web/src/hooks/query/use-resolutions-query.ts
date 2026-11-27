import { useQuery } from "@tanstack/react-query";
import { getResolutions, getResolutionsRecord } from "@/core-api/resolutions.api";

export function useResolutionsQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["resolutions", limit, offset], queryFn: () => getResolutions(limit, offset) });
}

export function useResolutionsRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["resolutions-record", recordId], queryFn: () => getResolutionsRecord(recordId), enabled: Boolean(recordId) });
}
