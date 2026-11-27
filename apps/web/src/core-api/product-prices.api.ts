import apiClient from "./api";
import type { SyntheticCollectionResponse, SyntheticRecordResponse } from "./types";

export async function getProductPrices(limit = 50, offset = 0): Promise<SyntheticCollectionResponse> {
  const response = await apiClient.get<{ data: SyntheticCollectionResponse }>("/product-prices", { params: { limit, offset } });
  return response.data.data;
}

export async function getProductPricesRecord(recordId: string): Promise<SyntheticRecordResponse> {
  const response = await apiClient.get<{ data: SyntheticRecordResponse }>("/product-prices/" + encodeURIComponent(recordId));
  return response.data.data;
}
