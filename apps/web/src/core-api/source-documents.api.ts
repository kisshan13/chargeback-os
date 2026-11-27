import apiClient from "./api";
import type { SyntheticCollectionResponse, SyntheticRecordResponse } from "./types";

export async function getSourceDocuments(limit = 50, offset = 0): Promise<SyntheticCollectionResponse> {
  const response = await apiClient.get<{ data: SyntheticCollectionResponse }>("/source-documents", { params: { limit, offset } });
  return response.data.data;
}

export async function getSourceDocumentsRecord(recordId: string): Promise<SyntheticRecordResponse> {
  const response = await apiClient.get<{ data: SyntheticRecordResponse }>("/source-documents/" + encodeURIComponent(recordId));
  return response.data.data;
}
