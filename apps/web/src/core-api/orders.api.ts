import apiClient from "./api";
import type { OrderOverview, SyntheticCollectionResponse, SyntheticRecordResponse } from "./types";

export async function getOrders(limit = 50, offset = 0): Promise<SyntheticCollectionResponse> {
  const response = await apiClient.get<{ data: SyntheticCollectionResponse }>("/orders", { params: { limit, offset } });
  return response.data.data;
}

export async function getOrdersRecord(recordId: string): Promise<SyntheticRecordResponse> {
  const response = await apiClient.get<{ data: SyntheticRecordResponse }>("/orders/" + encodeURIComponent(recordId));
  return response.data.data;
}

export async function getOrderOverview(recordId: string): Promise<OrderOverview> {
  const response = await apiClient.get<{ data: OrderOverview }>(`/orders/${encodeURIComponent(recordId)}/overview`);
  return response.data.data;
}
