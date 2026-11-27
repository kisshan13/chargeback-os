import apiClient from "./api";
import type { CreateDisputeInput, CreateDisputeResponse, DisputeOverview, SyntheticCollectionResponse, SyntheticRecordResponse } from "./types";

export async function getDisputes(limit = 50, offset = 0): Promise<SyntheticCollectionResponse> {
  const response = await apiClient.get<{ data: SyntheticCollectionResponse }>("/disputes", { params: { limit, offset } });
  return response.data.data;
}

export async function getDisputesRecord(recordId: string): Promise<SyntheticRecordResponse> {
  const response = await apiClient.get<{ data: SyntheticRecordResponse }>("/disputes/" + encodeURIComponent(recordId));
  return response.data.data;
}

export async function getDisputeOverview(recordId: string): Promise<DisputeOverview> {
  const response = await apiClient.get<{ data: DisputeOverview }>(`/disputes/${encodeURIComponent(recordId)}/overview`);
  return response.data.data;
}

export async function createDispute(input: CreateDisputeInput): Promise<CreateDisputeResponse> {
  const response = await apiClient.post<{ data: CreateDisputeResponse }>("/disputes", input);
  return response.data.data;
}
