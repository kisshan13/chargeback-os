import apiClient from "./api";
import type { PaymentOverview, SyntheticCollectionResponse, SyntheticRecordResponse } from "./types";

export async function getPayments(limit = 50, offset = 0): Promise<SyntheticCollectionResponse> {
  const response = await apiClient.get<{ data: SyntheticCollectionResponse }>("/payments", { params: { limit, offset } });
  return response.data.data;
}

export async function getPaymentsRecord(recordId: string): Promise<SyntheticRecordResponse> {
  const response = await apiClient.get<{ data: SyntheticRecordResponse }>("/payments/" + encodeURIComponent(recordId));
  return response.data.data;
}

export async function getPaymentOverview(recordId: string): Promise<PaymentOverview> {
  const response = await apiClient.get<{ data: PaymentOverview }>(`/payments/${encodeURIComponent(recordId)}/overview`);
  return response.data.data;
}
