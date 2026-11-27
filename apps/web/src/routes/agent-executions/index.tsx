import { useState } from "react";
import { useParams } from "react-router-dom";
import { SyntheticCollectionPage, SyntheticRecordPage } from "@/components/dashboard/synthetic-collection-page";
import { useAgentExecutionsQuery, useAgentExecutionsRecordQuery } from "@/hooks/query/use-agent-executions-query";

export function AgentExecutionsPage() {
  const [offset, setOffset] = useState(0);
  const query = useAgentExecutionsQuery(50, offset);
  return <SyntheticCollectionPage title="Agent Executions" path="agent-executions" query={query} offset={offset} onOffsetChange={setOffset} />;
}

export function AgentExecutionsRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useAgentExecutionsRecordQuery(recordId);
  return <SyntheticRecordPage title="Agent Executions" path="agent-executions" recordId={recordId} query={query} />;
}
