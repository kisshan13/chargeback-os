import { useQuery } from "@tanstack/react-query";
import { getShipments, getShipmentsRecord } from "@/core-api/shipments.api";

export function useShipmentsQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["shipments", limit, offset], queryFn: () => getShipments(limit, offset) });
}

export function useShipmentsRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["shipments-record", recordId], queryFn: () => getShipmentsRecord(recordId), enabled: Boolean(recordId) });
}
