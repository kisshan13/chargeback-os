import apiClient from "./api";
import type { SyntheticCollectionResponse, SyntheticRecordResponse } from "./types";

export async function getPolicyClauses(limit = 50, offset = 0): Promise<SyntheticCollectionResponse> {
  const response = await apiClient.get<{ data: SyntheticCollectionResponse }>("/policy-clauses", { params: { limit, offset } });
  return response.data.data;
}

export async function getPolicyClausesRecord(recordId: string): Promise<SyntheticRecordResponse> {
  const response = await apiClient.get<{ data: SyntheticRecordResponse }>("/policy-clauses/" + encodeURIComponent(recordId));
  return response.data.data;
}
