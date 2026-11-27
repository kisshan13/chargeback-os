import { useQuery } from "@tanstack/react-query";
import { getFindingVerifications, getFindingVerificationsRecord } from "@/core-api/finding-verifications.api";

export function useFindingVerificationsQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["finding-verifications", limit, offset], queryFn: () => getFindingVerifications(limit, offset) });
}

export function useFindingVerificationsRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["finding-verifications-record", recordId], queryFn: () => getFindingVerificationsRecord(recordId), enabled: Boolean(recordId) });
}
