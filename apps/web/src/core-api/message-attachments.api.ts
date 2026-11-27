import apiClient from "./api";
import type { SyntheticCollectionResponse, SyntheticRecordResponse } from "./types";

export async function getMessageAttachments(limit = 50, offset = 0): Promise<SyntheticCollectionResponse> {
  const response = await apiClient.get<{ data: SyntheticCollectionResponse }>("/message-attachments", { params: { limit, offset } });
  return response.data.data;
}

export async function getMessageAttachmentsRecord(recordId: string): Promise<SyntheticRecordResponse> {
  const response = await apiClient.get<{ data: SyntheticRecordResponse }>("/message-attachments/" + encodeURIComponent(recordId));
  return response.data.data;
}
