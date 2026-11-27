import { useQuery } from "@tanstack/react-query";
import { getFindingEvidence, getFindingEvidenceRecord } from "@/core-api/finding-evidence.api";

export function useFindingEvidenceQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["finding-evidence", limit, offset], queryFn: () => getFindingEvidence(limit, offset) });
}

export function useFindingEvidenceRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["finding-evidence-record", recordId], queryFn: () => getFindingEvidenceRecord(recordId), enabled: Boolean(recordId) });
}
