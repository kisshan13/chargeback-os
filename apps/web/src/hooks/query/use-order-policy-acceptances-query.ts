import { useQuery } from "@tanstack/react-query";
import { getOrderPolicyAcceptances, getOrderPolicyAcceptancesRecord } from "@/core-api/order-policy-acceptances.api";

export function useOrderPolicyAcceptancesQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["order-policy-acceptances", limit, offset], queryFn: () => getOrderPolicyAcceptances(limit, offset) });
}

export function useOrderPolicyAcceptancesRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["order-policy-acceptances-record", recordId], queryFn: () => getOrderPolicyAcceptancesRecord(recordId), enabled: Boolean(recordId) });
}
