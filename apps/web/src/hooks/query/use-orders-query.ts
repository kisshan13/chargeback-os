import { useQuery } from "@tanstack/react-query";
import { getOrderOverview, getOrders, getOrdersRecord } from "@/core-api/orders.api";

export function useOrdersQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["orders", limit, offset], queryFn: () => getOrders(limit, offset) });
}

export function useOrdersRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["orders-record", recordId], queryFn: () => getOrdersRecord(recordId), enabled: Boolean(recordId) });
}

export function useOrderOverviewQuery(recordId: string) {
  return useQuery({ queryKey: ["order-overview", recordId], queryFn: () => getOrderOverview(recordId), enabled: Boolean(recordId) });
}
