import { useQuery } from "@tanstack/react-query";
import { getDisputeEvents, getDisputeEventsRecord } from "@/core-api/dispute-events.api";

export function useDisputeEventsQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["dispute-events", limit, offset], queryFn: () => getDisputeEvents(limit, offset) });
}

export function useDisputeEventsRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["dispute-events-record", recordId], queryFn: () => getDisputeEventsRecord(recordId), enabled: Boolean(recordId) });
}
