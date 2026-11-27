import { useQuery } from "@tanstack/react-query";
import { getAddresses, getAddressesRecord } from "@/core-api/addresses.api";

export function useAddressesQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["addresses", limit, offset], queryFn: () => getAddresses(limit, offset) });
}

export function useAddressesRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["addresses-record", recordId], queryFn: () => getAddressesRecord(recordId), enabled: Boolean(recordId) });
}
