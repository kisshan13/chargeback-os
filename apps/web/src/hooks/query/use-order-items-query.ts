import { useQuery } from "@tanstack/react-query";
import { getOrderItems, getOrderItemsRecord } from "@/core-api/order-items.api";

export function useOrderItemsQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["order-items", limit, offset], queryFn: () => getOrderItems(limit, offset) });
}

export function useOrderItemsRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["order-items-record", recordId], queryFn: () => getOrderItemsRecord(recordId), enabled: Boolean(recordId) });
}
