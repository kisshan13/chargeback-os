import apiClient from "./api";
import type { SyntheticCollectionResponse, SyntheticRecordResponse } from "./types";

export async function getDeliveryConfirmations(limit = 50, offset = 0): Promise<SyntheticCollectionResponse> {
  const response = await apiClient.get<{ data: SyntheticCollectionResponse }>("/delivery-confirmations", { params: { limit, offset } });
  return response.data.data;
}

export async function getDeliveryConfirmationsRecord(recordId: string): Promise<SyntheticRecordResponse> {
  const response = await apiClient.get<{ data: SyntheticRecordResponse }>("/delivery-confirmations/" + encodeURIComponent(recordId));
  return response.data.data;
}
