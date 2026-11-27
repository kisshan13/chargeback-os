import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createDispute, getDisputeOverview, getDisputes, getDisputesRecord } from "@/core-api/disputes.api";
import type { CreateDisputeInput } from "@/core-api/types";

export function useDisputesQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["disputes", limit, offset], queryFn: () => getDisputes(limit, offset) });
}

export function useDisputesRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["disputes-record", recordId], queryFn: () => getDisputesRecord(recordId), enabled: Boolean(recordId) });
}

export function useDisputeOverviewQuery(recordId: string) {
  return useQuery({ queryKey: ["dispute-overview", recordId], queryFn: () => getDisputeOverview(recordId), enabled: Boolean(recordId) });
}

export function useCreateDisputeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateDisputeInput) => createDispute(input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["disputes"] }),
        queryClient.invalidateQueries({ queryKey: ["chargebacks"] }),
      ]);
    },
  });
}
