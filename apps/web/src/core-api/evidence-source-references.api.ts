import apiClient from "./api";
import type { SyntheticCollectionResponse, SyntheticRecordResponse } from "./types";

export async function getEvidenceSourceReferences(limit = 50, offset = 0): Promise<SyntheticCollectionResponse> {
  const response = await apiClient.get<{ data: SyntheticCollectionResponse }>("/evidence-source-references", { params: { limit, offset } });
  return response.data.data;
}

export async function getEvidenceSourceReferencesRecord(recordId: string): Promise<SyntheticRecordResponse> {
  const response = await apiClient.get<{ data: SyntheticRecordResponse }>("/evidence-source-references/" + encodeURIComponent(recordId));
  return response.data.data;
}
