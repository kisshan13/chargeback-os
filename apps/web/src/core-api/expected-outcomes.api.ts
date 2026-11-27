import apiClient from "./api";
import type { SyntheticCollectionResponse, SyntheticRecordResponse } from "./types";

export async function getExpectedOutcomes(limit = 50, offset = 0): Promise<SyntheticCollectionResponse> {
  const response = await apiClient.get<{ data: SyntheticCollectionResponse }>("/expected-outcomes", { params: { limit, offset } });
  return response.data.data;
}

export async function getExpectedOutcomesRecord(recordId: string): Promise<SyntheticRecordResponse> {
  const response = await apiClient.get<{ data: SyntheticRecordResponse }>("/expected-outcomes/" + encodeURIComponent(recordId));
  return response.data.data;
}
