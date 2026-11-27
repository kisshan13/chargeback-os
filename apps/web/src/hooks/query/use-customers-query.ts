import { useQuery } from "@tanstack/react-query";
import { getCustomerOverview, getCustomers, getCustomersRecord } from "@/core-api/customers.api";

export function useCustomersQuery(limit = 50, offset = 0) {
  return useQuery({ queryKey: ["customers", limit, offset], queryFn: () => getCustomers(limit, offset) });
}

export function useCustomersRecordQuery(recordId: string) {
  return useQuery({ queryKey: ["customers-record", recordId], queryFn: () => getCustomersRecord(recordId), enabled: Boolean(recordId) });
}

export function useCustomerOverviewQuery(recordId: string) {
  return useQuery({ queryKey: ["customer-overview", recordId], queryFn: () => getCustomerOverview(recordId), enabled: Boolean(recordId) });
}
