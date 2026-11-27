import apiClient from "./api";
import type { DisputeRun } from "./types";

export async function getDisputeRun(disputeId: string): Promise<DisputeRun> {
  const response = await apiClient.get<{ data: DisputeRun }>(`/disputes/${encodeURIComponent(disputeId)}/run`);
  return response.data.data;
}
