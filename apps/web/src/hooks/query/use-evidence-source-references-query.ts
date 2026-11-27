import { useQuery } from "@tanstack/react-query";
import { getEvidenceSourceReferences, getEvidenceSourceReferencesRecord } from "@/core-api/evidence-source-references.api";

export function useEvidenceSourceReferencesQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["evidence-source-references", limit, offset], queryFn: () => getEvidenceSourceReferences(limit, offset) });
}

export function useEvidenceSourceReferencesRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["evidence-source-references-record", recordId], queryFn: () => getEvidenceSourceReferencesRecord(recordId), enabled: Boolean(recordId) });
}
