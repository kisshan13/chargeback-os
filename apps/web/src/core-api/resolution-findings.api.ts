import apiClient from "./api";
import type { SyntheticCollectionResponse, SyntheticRecordResponse } from "./types";

export async function getResolutionFindings(limit = 50, offset = 0): Promise<SyntheticCollectionResponse> {
  const response = await apiClient.get<{ data: SyntheticCollectionResponse }>("/resolution-findings", { params: { limit, offset } });
  return response.data.data;
}

export async function getResolutionFindingsRecord(recordId: string): Promise<SyntheticRecordResponse> {
  const response = await apiClient.get<{ data: SyntheticRecordResponse }>("/resolution-findings/" + encodeURIComponent(recordId));
  return response.data.data;
}
