import { useQuery } from "@tanstack/react-query";
import { getEvidence, getEvidenceRecord } from "@/core-api/evidence.api";

export function useEvidenceQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["evidence", limit, offset], queryFn: () => getEvidence(limit, offset) });
}

export function useEvidenceRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["evidence-record", recordId], queryFn: () => getEvidenceRecord(recordId), enabled: Boolean(recordId) });
}
