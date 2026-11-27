import { useMutation, useQueryClient } from "@tanstack/react-query";
import { decideDisputeApproval } from "@/core-api/dispute-approvals.api";
import type { DecideDisputeApprovalInput } from "@/core-api/types";

export function useDisputeApprovalMutation(disputeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ approvalId, input }: { approvalId: string; input: DecideDisputeApprovalInput }) =>
      decideDisputeApproval(disputeId, approvalId, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dispute-run", disputeId] });
    },
  });
}
