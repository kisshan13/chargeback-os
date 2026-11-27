import apiClient from "./api";
import type { SyntheticCollectionResponse, SyntheticRecordResponse } from "./types";

export async function getDisputeRequirements(limit = 50, offset = 0): Promise<SyntheticCollectionResponse> {
  const response = await apiClient.get<{ data: SyntheticCollectionResponse }>("/dispute-requirements", { params: { limit, offset } });
  return response.data.data;
}

export async function getDisputeRequirementsRecord(recordId: string): Promise<SyntheticRecordResponse> {
  const response = await apiClient.get<{ data: SyntheticRecordResponse }>("/dispute-requirements/" + encodeURIComponent(recordId));
  return response.data.data;
}
