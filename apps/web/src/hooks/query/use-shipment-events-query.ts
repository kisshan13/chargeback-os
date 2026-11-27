import { useQuery } from "@tanstack/react-query";
import { getShipmentEvents, getShipmentEventsRecord } from "@/core-api/shipment-events.api";

export function useShipmentEventsQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["shipment-events", limit, offset], queryFn: () => getShipmentEvents(limit, offset) });
}

export function useShipmentEventsRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["shipment-events-record", recordId], queryFn: () => getShipmentEventsRecord(recordId), enabled: Boolean(recordId) });
}
