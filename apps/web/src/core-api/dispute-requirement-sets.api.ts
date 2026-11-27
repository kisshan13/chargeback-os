import apiClient from "./api";
import type { SyntheticCollectionResponse, SyntheticRecordResponse } from "./types";

export async function getDisputeRequirementSets(limit = 50, offset = 0): Promise<SyntheticCollectionResponse> {
  const response = await apiClient.get<{ data: SyntheticCollectionResponse }>("/dispute-requirement-sets", { params: { limit, offset } });
  return response.data.data;
}

export async function getDisputeRequirementSetsRecord(recordId: string): Promise<SyntheticRecordResponse> {
  const response = await apiClient.get<{ data: SyntheticRecordResponse }>("/dispute-requirement-sets/" + encodeURIComponent(recordId));
  return response.data.data;
}
