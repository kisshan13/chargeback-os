import { useQuery } from "@tanstack/react-query";
import { getConversations, getConversationsRecord } from "@/core-api/conversations.api";

export function useConversationsQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["conversations", limit, offset], queryFn: () => getConversations(limit, offset) });
}

export function useConversationsRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["conversations-record", recordId], queryFn: () => getConversationsRecord(recordId), enabled: Boolean(recordId) });
}
