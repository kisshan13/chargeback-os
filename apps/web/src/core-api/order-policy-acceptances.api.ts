import apiClient from "./api";
import type { SyntheticCollectionResponse, SyntheticRecordResponse } from "./types";

export async function getOrderPolicyAcceptances(limit = 50, offset = 0): Promise<SyntheticCollectionResponse> {
  const response = await apiClient.get<{ data: SyntheticCollectionResponse }>("/order-policy-acceptances", { params: { limit, offset } });
  return response.data.data;
}

export async function getOrderPolicyAcceptancesRecord(recordId: string): Promise<SyntheticRecordResponse> {
  const response = await apiClient.get<{ data: SyntheticRecordResponse }>("/order-policy-acceptances/" + encodeURIComponent(recordId));
  return response.data.data;
}
