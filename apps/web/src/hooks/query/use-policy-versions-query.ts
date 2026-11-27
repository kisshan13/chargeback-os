import { useQuery } from "@tanstack/react-query";
import { getPolicyVersions, getPolicyVersionsRecord } from "@/core-api/policy-versions.api";

export function usePolicyVersionsQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["policy-versions", limit, offset], queryFn: () => getPolicyVersions(limit, offset) });
}

export function usePolicyVersionsRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["policy-versions-record", recordId], queryFn: () => getPolicyVersionsRecord(recordId), enabled: Boolean(recordId) });
}
