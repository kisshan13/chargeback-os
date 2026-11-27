import apiClient from "./api";
import type { SyntheticCollectionResponse, SyntheticRecordResponse } from "./types";

export async function getShipmentEvents(limit = 50, offset = 0): Promise<SyntheticCollectionResponse> {
  const response = await apiClient.get<{ data: SyntheticCollectionResponse }>("/shipment-events", { params: { limit, offset } });
  return response.data.data;
}

export async function getShipmentEventsRecord(recordId: string): Promise<SyntheticRecordResponse> {
  const response = await apiClient.get<{ data: SyntheticRecordResponse }>("/shipment-events/" + encodeURIComponent(recordId));
  return response.data.data;
}
