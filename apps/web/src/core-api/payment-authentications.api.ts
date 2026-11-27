import apiClient from "./api";
import type { SyntheticCollectionResponse, SyntheticRecordResponse } from "./types";

export async function getPaymentAuthentications(limit = 50, offset = 0): Promise<SyntheticCollectionResponse> {
  const response = await apiClient.get<{ data: SyntheticCollectionResponse }>("/payment-authentications", { params: { limit, offset } });
  return response.data.data;
}

export async function getPaymentAuthenticationsRecord(recordId: string): Promise<SyntheticRecordResponse> {
  const response = await apiClient.get<{ data: SyntheticRecordResponse }>("/payment-authentications/" + encodeURIComponent(recordId));
  return response.data.data;
}
