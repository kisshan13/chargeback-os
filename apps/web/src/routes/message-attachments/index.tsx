import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useMessageAttachmentsQuery, useMessageAttachmentsRecordQuery } from "@/hooks/query/use-message-attachments-query";

export function MessageAttachmentsPage() {
  const [offset, setOffset] = useState(0);
  const query = useMessageAttachmentsQuery(50, offset);
  return <SyntheticCollectionPage title="Message Attachments" path="message-attachments" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function MessageAttachmentsRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useMessageAttachmentsRecordQuery(recordId);
  return <SyntheticRecordPage title="Message Attachments" path="message-attachments" recordId={recordId} query={query} />;
}
