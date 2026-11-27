import apiClient from "./api";
import type { SyntheticCollectionResponse, SyntheticRecordResponse } from "./types";

export async function getDigitalFulfillmentEvents(limit = 50, offset = 0): Promise<SyntheticCollectionResponse> {
  const response = await apiClient.get<{ data: SyntheticCollectionResponse }>("/digital-fulfillment-events", { params: { limit, offset } });
  return response.data.data;
}

export async function getDigitalFulfillmentEventsRecord(recordId: string): Promise<SyntheticRecordResponse> {
  const response = await apiClient.get<{ data: SyntheticRecordResponse }>("/digital-fulfillment-events/" + encodeURIComponent(recordId));
  return response.data.data;
}
