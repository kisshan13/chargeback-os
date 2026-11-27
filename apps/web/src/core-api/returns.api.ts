import apiClient from "./api";
import type { SyntheticCollectionResponse, SyntheticRecordResponse } from "./types";

export async function getReturns(limit = 50, offset = 0): Promise<SyntheticCollectionResponse> {
  const response = await apiClient.get<{ data: SyntheticCollectionResponse }>("/returns", { params: { limit, offset } });
  return response.data.data;
}

export async function getReturnsRecord(recordId: string): Promise<SyntheticRecordResponse> {
  const response = await apiClient.get<{ data: SyntheticRecordResponse }>("/returns/" + encodeURIComponent(recordId));
  return response.data.data;
}
