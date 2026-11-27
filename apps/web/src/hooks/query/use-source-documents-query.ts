import { useQuery } from "@tanstack/react-query";
import { getSourceDocuments, getSourceDocumentsRecord } from "@/core-api/source-documents.api";

export function useSourceDocumentsQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["source-documents", limit, offset], queryFn: () => getSourceDocuments(limit, offset) });
}

export function useSourceDocumentsRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["source-documents-record", recordId], queryFn: () => getSourceDocumentsRecord(recordId), enabled: Boolean(recordId) });
}
