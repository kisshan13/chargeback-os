import apiClient from "./api";
import type { SyntheticCollectionResponse, SyntheticRecordResponse } from "./types";

export async function getRefundTransactions(limit = 50, offset = 0): Promise<SyntheticCollectionResponse> {
  const response = await apiClient.get<{ data: SyntheticCollectionResponse }>("/refund-transactions", { params: { limit, offset } });
  return response.data.data;
}

export async function getRefundTransactionsRecord(recordId: string): Promise<SyntheticRecordResponse> {
  const response = await apiClient.get<{ data: SyntheticRecordResponse }>("/refund-transactions/" + encodeURIComponent(recordId));
  return response.data.data;
}
