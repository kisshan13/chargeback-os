import { useQuery } from "@tanstack/react-query";
import { getProductPrices, getProductPricesRecord } from "@/core-api/product-prices.api";

export function useProductPricesQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["product-prices", limit, offset], queryFn: () => getProductPrices(limit, offset) });
}

export function useProductPricesRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["product-prices-record", recordId], queryFn: () => getProductPricesRecord(recordId), enabled: Boolean(recordId) });
}
