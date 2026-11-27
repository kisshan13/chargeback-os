import { useQuery } from "@tanstack/react-query";
import { getPolicies, getPoliciesRecord, getPolicyOverview } from "@/core-api/policies.api";

export function usePoliciesQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["policies", limit, offset], queryFn: () => getPolicies(limit, offset) });
}

export function usePoliciesRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["policies-record", recordId], queryFn: () => getPoliciesRecord(recordId), enabled: Boolean(recordId) });
}

export function usePolicyOverviewQuery(recordId: string) {
  return useQuery({ queryKey: ["policy-overview", recordId], queryFn: () => getPolicyOverview(recordId), enabled: Boolean(recordId) });
}
