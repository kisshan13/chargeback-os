import apiClient from "./api";
import type { ProductOverview, SyntheticCollectionResponse, SyntheticRecordResponse } from "./types";

export async function getProducts(limit = 50, offset = 0): Promise<SyntheticCollectionResponse> {
  const response = await apiClient.get<{ data: SyntheticCollectionResponse }>("/products", { params: { limit, offset } });
  return response.data.data;
}

export async function getProductsRecord(recordId: string): Promise<SyntheticRecordResponse> {
  const response = await apiClient.get<{ data: SyntheticRecordResponse }>("/products/" + encodeURIComponent(recordId));
  return response.data.data;
}

export async function getProductOverview(recordId: string): Promise<ProductOverview> {
  const response = await apiClient.get<{ data: ProductOverview }>(`/products/${encodeURIComponent(recordId)}/overview`);
  return response.data.data;
}
