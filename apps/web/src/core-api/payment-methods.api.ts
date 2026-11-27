import apiClient from "./api";
import type { SyntheticCollectionResponse, SyntheticRecordResponse } from "./types";

export async function getPaymentMethods(limit = 50, offset = 0): Promise<SyntheticCollectionResponse> {
  const response = await apiClient.get<{ data: SyntheticCollectionResponse }>("/payment-methods", { params: { limit, offset } });
  return response.data.data;
}

export async function getPaymentMethodsRecord(recordId: string): Promise<SyntheticRecordResponse> {
  const response = await apiClient.get<{ data: SyntheticRecordResponse }>("/payment-methods/" + encodeURIComponent(recordId));
  return response.data.data;
}
