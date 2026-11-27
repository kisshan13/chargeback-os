import { useQuery } from "@tanstack/react-query";
import { getMessageAttachments, getMessageAttachmentsRecord } from "@/core-api/message-attachments.api";

export function useMessageAttachmentsQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["message-attachments", limit, offset], queryFn: () => getMessageAttachments(limit, offset) });
}

export function useMessageAttachmentsRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["message-attachments-record", recordId], queryFn: () => getMessageAttachmentsRecord(recordId), enabled: Boolean(recordId) });
}
