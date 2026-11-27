import { useQuery } from "@tanstack/react-query";
import { getMerchants, getMerchantsRecord } from "@/core-api/merchants.api";

export function useMerchantsQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["merchants", limit, offset], queryFn: () => getMerchants(limit, offset) });
}

export function useMerchantsRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["merchants-record", recordId], queryFn: () => getMerchantsRecord(recordId), enabled: Boolean(recordId) });
}
