import apiClient from "./api";
import type { CustomerOverview, SyntheticCollectionResponse, SyntheticRecordResponse } from "./types";

export async function getCustomers(limit = 50, offset = 0): Promise<SyntheticCollectionResponse> {
  const response = await apiClient.get<{ data: SyntheticCollectionResponse }>("/customers", { params: { limit, offset } });
  return response.data.data;
}

export async function getCustomersRecord(recordId: string): Promise<SyntheticRecordResponse> {
  const response = await apiClient.get<{ data: SyntheticRecordResponse }>("/customers/" + encodeURIComponent(recordId));
  return response.data.data;
}

export async function getCustomerOverview(recordId: string): Promise<CustomerOverview> {
  const response = await apiClient.get<{ data: CustomerOverview }>(`/customers/${encodeURIComponent(recordId)}/overview`);
  return response.data.data;
}
