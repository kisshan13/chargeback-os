import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useProductPricesQuery, useProductPricesRecordQuery } from "@/hooks/query/use-product-prices-query";

export function ProductPricesPage() {
  const [offset, setOffset] = useState(0);
  const query = useProductPricesQuery(50, offset);
  return <SyntheticCollectionPage title="Product Prices" path="product-prices" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function ProductPricesRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useProductPricesRecordQuery(recordId);
  return <SyntheticRecordPage title="Product Prices" path="product-prices" recordId={recordId} query={query} />;
}
