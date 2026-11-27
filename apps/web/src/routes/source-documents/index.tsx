import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useSourceDocumentsQuery, useSourceDocumentsRecordQuery } from "@/hooks/query/use-source-documents-query";

export function SourceDocumentsPage() {
  const [offset, setOffset] = useState(0);
  const query = useSourceDocumentsQuery(50, offset);
  return <SyntheticCollectionPage title="Source Documents" path="source-documents" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function SourceDocumentsRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useSourceDocumentsRecordQuery(recordId);
  return <SyntheticRecordPage title="Source Documents" path="source-documents" recordId={recordId} query={query} />;
}
