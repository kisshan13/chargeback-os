import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useMessagesQuery, useMessagesRecordQuery } from "@/hooks/query/use-messages-query";

export function MessagesPage() {
  const [offset, setOffset] = useState(0);
  const query = useMessagesQuery(50, offset);
  return <SyntheticCollectionPage title="Messages" path="messages" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function MessagesRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useMessagesRecordQuery(recordId);
  return <SyntheticRecordPage title="Messages" path="messages" recordId={recordId} query={query} />;
}
