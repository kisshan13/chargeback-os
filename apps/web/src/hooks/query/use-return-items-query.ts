import { useQuery } from "@tanstack/react-query";
import { getReturnItems, getReturnItemsRecord } from "@/core-api/return-items.api";

export function useReturnItemsQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["return-items", limit, offset], queryFn: () => getReturnItems(limit, offset) });
}

export function useReturnItemsRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["return-items-record", recordId], queryFn: () => getReturnItemsRecord(recordId), enabled: Boolean(recordId) });
}
