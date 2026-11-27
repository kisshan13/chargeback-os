import { useQuery } from "@tanstack/react-query";
import { getExpectedOutcomes, getExpectedOutcomesRecord } from "@/core-api/expected-outcomes.api";

export function useExpectedOutcomesQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["expected-outcomes", limit, offset], queryFn: () => getExpectedOutcomes(limit, offset) });
}

export function useExpectedOutcomesRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["expected-outcomes-record", recordId], queryFn: () => getExpectedOutcomesRecord(recordId), enabled: Boolean(recordId) });
}
