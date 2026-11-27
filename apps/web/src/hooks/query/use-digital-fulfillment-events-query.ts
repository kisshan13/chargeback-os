import { useQuery } from "@tanstack/react-query";
import { getDigitalFulfillmentEvents, getDigitalFulfillmentEventsRecord } from "@/core-api/digital-fulfillment-events.api";

export function useDigitalFulfillmentEventsQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["digital-fulfillment-events", limit, offset], queryFn: () => getDigitalFulfillmentEvents(limit, offset) });
}

export function useDigitalFulfillmentEventsRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["digital-fulfillment-events-record", recordId], queryFn: () => getDigitalFulfillmentEventsRecord(recordId), enabled: Boolean(recordId) });
}
