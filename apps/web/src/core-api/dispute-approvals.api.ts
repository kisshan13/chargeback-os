import apiClient from "./api";
import type { DecideDisputeApprovalInput, DecideDisputeApprovalResponse } from "./types";

export async function decideDisputeApproval(
  disputeId: string,
  approvalId: string,
  input: DecideDisputeApprovalInput,
): Promise<DecideDisputeApprovalResponse> {
  const response = await apiClient.post<{ data: DecideDisputeApprovalResponse }>(
    `/disputes/${encodeURIComponent(disputeId)}/approvals/${encodeURIComponent(approvalId)}`,
    input,
  );
  return response.data.data;
}
