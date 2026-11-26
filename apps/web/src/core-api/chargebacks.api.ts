import apiClient from "./api";
import type {
  ChargebackDashboard,
  ChargebackDispute,
  ChargebackDisputesResponse
} from "./types";

export async function getChargebackDashboard(): Promise<ChargebackDashboard> {
  const response = await apiClient.get<{ data: ChargebackDashboard }>("/chargebacks");
  return response.data.data;
}

export async function getChargebackDisputes(): Promise<ChargebackDisputesResponse> {
  const response = await apiClient.get<{ data: ChargebackDisputesResponse }>("/chargebacks/disputes");
  return response.data.data;
}

export async function getChargebackDispute(disputeId: string): Promise<ChargebackDispute> {
  const response = await apiClient.get<{ data: ChargebackDispute }>(`/chargebacks/disputes/${disputeId}`);
  return response.data.data;
}
