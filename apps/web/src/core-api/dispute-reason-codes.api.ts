import apiClient from "./api";
import type { SyntheticCollectionResponse, SyntheticRecordResponse } from "./types";

export async function getDisputeReasonCodes(limit = 50, offset = 0): Promise<SyntheticCollectionResponse> {
  const response = await apiClient.get<{ data: SyntheticCollectionResponse }>("/dispute-reason-codes", { params: { limit, offset } });
  return response.data.data;
}

export async function getDisputeReasonCodesRecord(recordId: string): Promise<SyntheticRecordResponse> {
  const response = await apiClient.get<{ data: SyntheticRecordResponse }>("/dispute-reason-codes/" + encodeURIComponent(recordId));
  return response.data.data;
}
