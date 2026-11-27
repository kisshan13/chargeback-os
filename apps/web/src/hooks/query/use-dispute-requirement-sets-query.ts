import { useQuery } from "@tanstack/react-query";
import { getDisputeRequirementSets, getDisputeRequirementSetsRecord } from "@/core-api/dispute-requirement-sets.api";

export function useDisputeRequirementSetsQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["dispute-requirement-sets", limit, offset], queryFn: () => getDisputeRequirementSets(limit, offset) });
}

export function useDisputeRequirementSetsRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["dispute-requirement-sets-record", recordId], queryFn: () => getDisputeRequirementSetsRecord(recordId), enabled: Boolean(recordId) });
}
