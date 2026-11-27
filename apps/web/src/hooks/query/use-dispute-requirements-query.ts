import { useQuery } from "@tanstack/react-query";
import { getDisputeRequirements, getDisputeRequirementsRecord } from "@/core-api/dispute-requirements.api";

export function useDisputeRequirementsQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["dispute-requirements", limit, offset], queryFn: () => getDisputeRequirements(limit, offset) });
}

export function useDisputeRequirementsRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["dispute-requirements-record", recordId], queryFn: () => getDisputeRequirementsRecord(recordId), enabled: Boolean(recordId) });
}
