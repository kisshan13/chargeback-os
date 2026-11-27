import { useQuery } from "@tanstack/react-query";
import { getDisputeRun } from "@/core-api/dispute-run.api";

export function useDisputeRunQuery(disputeId: string) {
  return useQuery({
    queryKey: ["dispute-run", disputeId],
    queryFn: () => getDisputeRun(disputeId),
    enabled: Boolean(disputeId),
  });
}
