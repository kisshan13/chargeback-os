import apiClient from "./api";
import type { PolicyOverview, SyntheticCollectionResponse, SyntheticRecordResponse } from "./types";

export async function getPolicies(limit = 50, offset = 0): Promise<SyntheticCollectionResponse> {
  const response = await apiClient.get<{ data: SyntheticCollectionResponse }>("/policies", { params: { limit, offset } });
  return response.data.data;
}

export async function getPoliciesRecord(recordId: string): Promise<SyntheticRecordResponse> {
  const response = await apiClient.get<{ data: SyntheticRecordResponse }>("/policies/" + encodeURIComponent(recordId));
  return response.data.data;
}

export async function getPolicyOverview(recordId: string): Promise<PolicyOverview> {
  const response = await apiClient.get<{ data: PolicyOverview }>(`/policies/${encodeURIComponent(recordId)}/overview`);
  return response.data.data;
}
