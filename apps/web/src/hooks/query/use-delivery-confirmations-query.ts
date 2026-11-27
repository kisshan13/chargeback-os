import { useQuery } from "@tanstack/react-query";
import { getDeliveryConfirmations, getDeliveryConfirmationsRecord } from "@/core-api/delivery-confirmations.api";

export function useDeliveryConfirmationsQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["delivery-confirmations", limit, offset], queryFn: () => getDeliveryConfirmations(limit, offset) });
}

export function useDeliveryConfirmationsRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["delivery-confirmations-record", recordId], queryFn: () => getDeliveryConfirmationsRecord(recordId), enabled: Boolean(recordId) });
}
