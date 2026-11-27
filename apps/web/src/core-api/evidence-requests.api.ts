import apiClient from "./api";
import type { SyntheticCollectionResponse, SyntheticRecordResponse } from "./types";

export async function getEvidenceRequests(limit = 50, offset = 0): Promise<SyntheticCollectionResponse> {
  const response = await apiClient.get<{ data: SyntheticCollectionResponse }>("/evidence-requests", { params: { limit, offset } });
  return response.data.data;
}

export async function getEvidenceRequestsRecord(recordId: string): Promise<SyntheticRecordResponse> {
  const response = await apiClient.get<{ data: SyntheticRecordResponse }>("/evidence-requests/" + encodeURIComponent(recordId));
  return response.data.data;
}
