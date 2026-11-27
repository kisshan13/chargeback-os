import { useQuery } from "@tanstack/react-query";
import { getShipmentItems, getShipmentItemsRecord } from "@/core-api/shipment-items.api";

export function useShipmentItemsQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["shipment-items", limit, offset], queryFn: () => getShipmentItems(limit, offset) });
}

export function useShipmentItemsRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["shipment-items-record", recordId], queryFn: () => getShipmentItemsRecord(recordId), enabled: Boolean(recordId) });
}
