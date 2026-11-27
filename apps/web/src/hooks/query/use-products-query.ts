import { useQuery } from "@tanstack/react-query";
import { getProductOverview, getProducts, getProductsRecord } from "@/core-api/products.api";

export function useProductsQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["products", limit, offset], queryFn: () => getProducts(limit, offset) });
}

export function useProductsRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["products-record", recordId], queryFn: () => getProductsRecord(recordId), enabled: Boolean(recordId) });
}

export function useProductOverviewQuery(recordId: string) {
  return useQuery({ queryKey: ["product-overview", recordId], queryFn: () => getProductOverview(recordId), enabled: Boolean(recordId) });
}
