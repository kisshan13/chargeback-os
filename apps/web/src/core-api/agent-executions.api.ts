import apiClient from "./api";
import type { SyntheticCollectionResponse, SyntheticRecordResponse } from "./types";

export async function getAgentExecutions(limit = 50, offset = 0): Promise<SyntheticCollectionResponse> {
  const response = await apiClient.get<{ data: SyntheticCollectionResponse }>("/agent-executions", { params: { limit, offset } });
  return response.data.data;
}

export async function getAgentExecutionsRecord(recordId: string): Promise<SyntheticRecordResponse> {
  const response = await apiClient.get<{ data: SyntheticRecordResponse }>("/agent-executions/" + encodeURIComponent(recordId));
  return response.data.data;
}
