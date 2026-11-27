import { useQuery } from "@tanstack/react-query";
import { getDisputeReasonCodes, getDisputeReasonCodesRecord } from "@/core-api/dispute-reason-codes.api";

export function useDisputeReasonCodesQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["dispute-reason-codes", limit, offset], queryFn: () => getDisputeReasonCodes(limit, offset) });
}

export function useDisputeReasonCodesRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["dispute-reason-codes-record", recordId], queryFn: () => getDisputeReasonCodesRecord(recordId), enabled: Boolean(recordId) });
}
