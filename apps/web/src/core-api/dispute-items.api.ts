import apiClient from "./api";
import type { SyntheticCollectionResponse, SyntheticRecordResponse } from "./types";

export async function getDisputeItems(limit = 50, offset = 0): Promise<SyntheticCollectionResponse> {
  const response = await apiClient.get<{ data: SyntheticCollectionResponse }>("/dispute-items", { params: { limit, offset } });
  return response.data.data;
}

export async function getDisputeItemsRecord(recordId: string): Promise<SyntheticRecordResponse> {
  const response = await apiClient.get<{ data: SyntheticRecordResponse }>("/dispute-items/" + encodeURIComponent(recordId));
  return response.data.data;
}
