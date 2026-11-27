import apiClient from "./api";
import type { SyntheticCollectionResponse, SyntheticRecordResponse } from "./types";

export async function getPolicyVersions(limit = 50, offset = 0): Promise<SyntheticCollectionResponse> {
  const response = await apiClient.get<{ data: SyntheticCollectionResponse }>("/policy-versions", { params: { limit, offset } });
  return response.data.data;
}

export async function getPolicyVersionsRecord(recordId: string): Promise<SyntheticRecordResponse> {
  const response = await apiClient.get<{ data: SyntheticRecordResponse }>("/policy-versions/" + encodeURIComponent(recordId));
  return response.data.data;
}
