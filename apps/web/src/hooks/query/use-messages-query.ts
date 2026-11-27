import { useQuery } from "@tanstack/react-query";
import { getMessages, getMessagesRecord } from "@/core-api/messages.api";

export function useMessagesQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["messages", limit, offset], queryFn: () => getMessages(limit, offset) });
}

export function useMessagesRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["messages-record", recordId], queryFn: () => getMessagesRecord(recordId), enabled: Boolean(recordId) });
}
