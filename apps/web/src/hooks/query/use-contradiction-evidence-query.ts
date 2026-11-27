import { useQuery } from "@tanstack/react-query";
import { getContradictionEvidence, getContradictionEvidenceRecord } from "@/core-api/contradiction-evidence.api";

export function useContradictionEvidenceQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["contradiction-evidence", limit, offset], queryFn: () => getContradictionEvidence(limit, offset) });
}

export function useContradictionEvidenceRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["contradiction-evidence-record", recordId], queryFn: () => getContradictionEvidenceRecord(recordId), enabled: Boolean(recordId) });
}
