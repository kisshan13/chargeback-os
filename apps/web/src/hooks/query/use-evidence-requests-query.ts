import { useQuery } from "@tanstack/react-query";
import { getEvidenceRequests, getEvidenceRequestsRecord } from "@/core-api/evidence-requests.api";

export function useEvidenceRequestsQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["evidence-requests", limit, offset], queryFn: () => getEvidenceRequests(limit, offset) });
}

export function useEvidenceRequestsRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["evidence-requests-record", recordId], queryFn: () => getEvidenceRequestsRecord(recordId), enabled: Boolean(recordId) });
}
