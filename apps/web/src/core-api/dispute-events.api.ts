import apiClient from "./api";
import type { SyntheticCollectionResponse, SyntheticRecordResponse } from "./types";

export async function getDisputeEvents(limit = 50, offset = 0): Promise<SyntheticCollectionResponse> {
  const response = await apiClient.get<{ data: SyntheticCollectionResponse }>("/dispute-events", { params: { limit, offset } });
  return response.data.data;
}

export async function getDisputeEventsRecord(recordId: string): Promise<SyntheticRecordResponse> {
  const response = await apiClient.get<{ data: SyntheticRecordResponse }>("/dispute-events/" + encodeURIComponent(recordId));
  return response.data.data;
}
