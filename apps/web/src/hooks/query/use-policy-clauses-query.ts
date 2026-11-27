import { useQuery } from "@tanstack/react-query";
import { getPolicyClauses, getPolicyClausesRecord } from "@/core-api/policy-clauses.api";

export function usePolicyClausesQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["policy-clauses", limit, offset], queryFn: () => getPolicyClauses(limit, offset) });
}

export function usePolicyClausesRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["policy-clauses-record", recordId], queryFn: () => getPolicyClausesRecord(recordId), enabled: Boolean(recordId) });
}
