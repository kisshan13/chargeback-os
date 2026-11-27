import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useConversationsQuery, useConversationsRecordQuery } from "@/hooks/query/use-conversations-query";

export function ConversationsPage() {
  const [offset, setOffset] = useState(0);
  const query = useConversationsQuery(50, offset);
  return <SyntheticCollectionPage title="Conversations" path="conversations" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function ConversationsRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useConversationsRecordQuery(recordId);
  return <SyntheticRecordPage title="Conversations" path="conversations" recordId={recordId} query={query} />;
}
