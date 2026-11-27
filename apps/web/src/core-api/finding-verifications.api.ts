import apiClient from "./api";
import type { SyntheticCollectionResponse, SyntheticRecordResponse } from "./types";

export async function getFindingVerifications(limit = 50, offset = 0): Promise<SyntheticCollectionResponse> {
  const response = await apiClient.get<{ data: SyntheticCollectionResponse }>("/finding-verifications", { params: { limit, offset } });
  return response.data.data;
}

export async function getFindingVerificationsRecord(recordId: string): Promise<SyntheticRecordResponse> {
  const response = await apiClient.get<{ data: SyntheticRecordResponse }>("/finding-verifications/" + encodeURIComponent(recordId));
  return response.data.data;
}
