import apiClient from "./api";
import type { StartDisputeDemoRunInput, StartDisputeDemoRunResponse } from "./types";

export async function startDisputeDemoRun(input: StartDisputeDemoRunInput): Promise<StartDisputeDemoRunResponse> {
  const response = await apiClient.post<{ data: StartDisputeDemoRunResponse }>("/disputes/demo-runs", input);
  return response.data.data;
}
