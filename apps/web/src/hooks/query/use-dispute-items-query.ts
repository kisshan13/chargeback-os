import { useQuery } from "@tanstack/react-query";
import { getDisputeItems, getDisputeItemsRecord } from "@/core-api/dispute-items.api";

export function useDisputeItemsQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["dispute-items", limit, offset], queryFn: () => getDisputeItems(limit, offset) });
}

export function useDisputeItemsRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["dispute-items-record", recordId], queryFn: () => getDisputeItemsRecord(recordId), enabled: Boolean(recordId) });
}
