import apiClient from "./api";
import type { SyntheticCollectionResponse, SyntheticRecordResponse } from "./types";

export async function getInvestigationRuns(limit = 50, offset = 0): Promise<SyntheticCollectionResponse> {
  const response = await apiClient.get<{ data: SyntheticCollectionResponse }>("/investigation-runs", { params: { limit, offset } });
  return response.data.data;
}

export async function getInvestigationRunsRecord(recordId: string): Promise<SyntheticRecordResponse> {
  const response = await apiClient.get<{ data: SyntheticRecordResponse }>("/investigation-runs/" + encodeURIComponent(recordId));
  return response.data.data;
}
