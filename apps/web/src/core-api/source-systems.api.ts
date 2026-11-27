import apiClient from "./api";
import type { SyntheticCollectionResponse, SyntheticRecordResponse } from "./types";

export async function getSourceSystems(limit = 50, offset = 0): Promise<SyntheticCollectionResponse> {
  const response = await apiClient.get<{ data: SyntheticCollectionResponse }>("/source-systems", { params: { limit, offset } });
  return response.data.data;
}

export async function getSourceSystemsRecord(recordId: string): Promise<SyntheticRecordResponse> {
  const response = await apiClient.get<{ data: SyntheticRecordResponse }>("/source-systems/" + encodeURIComponent(recordId));
  return response.data.data;
}
