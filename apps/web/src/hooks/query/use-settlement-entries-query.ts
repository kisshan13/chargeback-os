import { useQuery } from "@tanstack/react-query";
import { getSettlementEntries, getSettlementEntriesRecord } from "@/core-api/settlement-entries.api";

export function useSettlementEntriesQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["settlement-entries", limit, offset], queryFn: () => getSettlementEntries(limit, offset) });
}

export function useSettlementEntriesRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["settlement-entries-record", recordId], queryFn: () => getSettlementEntriesRecord(recordId), enabled: Boolean(recordId) });
}
