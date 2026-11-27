import apiClient from "./api";
import type { SyntheticCollectionResponse, SyntheticRecordResponse } from "./types";

export async function getShipmentItems(limit = 50, offset = 0): Promise<SyntheticCollectionResponse> {
  const response = await apiClient.get<{ data: SyntheticCollectionResponse }>("/shipment-items", { params: { limit, offset } });
  return response.data.data;
}

export async function getShipmentItemsRecord(recordId: string): Promise<SyntheticRecordResponse> {
  const response = await apiClient.get<{ data: SyntheticRecordResponse }>("/shipment-items/" + encodeURIComponent(recordId));
  return response.data.data;
}
