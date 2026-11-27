import { useMutation, useQueryClient } from "@tanstack/react-query";
import { startDisputeDemoRun } from "@/core-api/dispute-demo-runs.api";
import type { StartDisputeDemoRunInput } from "@/core-api/types";

export function useDisputeDemoRunMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: StartDisputeDemoRunInput) => startDisputeDemoRun(input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["disputes"] }),
        queryClient.invalidateQueries({ queryKey: ["chargebacks"] }),
      ]);
    },
  });
}
