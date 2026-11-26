import { useQuery } from "@tanstack/react-query";
import {
  getChargebackDashboard,
  getChargebackDispute,
  getChargebackDisputes
} from "@/core-api/chargebacks.api";

export function useChargebackDashboardQuery() {
  return useQuery({
    queryKey: ["chargebacks-dashboard"],
    queryFn: getChargebackDashboard
  });
}

export function useChargebackDisputesQuery() {
  return useQuery({
    queryKey: ["chargeback-disputes"],
    queryFn: getChargebackDisputes
  });
}

export function useChargebackDisputeQuery(disputeId: string) {
  return useQuery({
    queryKey: ["chargeback-dispute", disputeId],
    queryFn: () => getChargebackDispute(disputeId),
    enabled: Boolean(disputeId)
  });
}
