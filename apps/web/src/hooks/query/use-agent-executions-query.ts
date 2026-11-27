import { useQuery } from "@tanstack/react-query";
import { getAgentExecutions, getAgentExecutionsRecord } from "@/core-api/agent-executions.api";

export function useAgentExecutionsQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["agent-executions", limit, offset], queryFn: () => getAgentExecutions(limit, offset) });
}

export function useAgentExecutionsRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["agent-executions-record", recordId], queryFn: () => getAgentExecutionsRecord(recordId), enabled: Boolean(recordId) });
}
