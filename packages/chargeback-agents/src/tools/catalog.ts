import type { Tool } from "@mozaik-ai/core";

export const CHARGEBACK_TOOL_NAMES = {
  loadDispute: "chargeback.load_dispute",
  loadOrder: "chargeback.load_order",
  loadPayment: "chargeback.load_payment",
  loadFulfillment: "chargeback.load_fulfillment",
  loadCustomerCommunications: "chargeback.load_customer_communications",
  saveEvidence: "chargeback.save_evidence",
  createFinding: "chargeback.create_finding",
  createEvidenceRequest: "chargeback.create_evidence_request",
  proposeResolution: "chargeback.propose_resolution",
  submitProviderResponse: "chargeback.submit_provider_response",
} as const;

export interface ChargebackToolPorts {
  loadDispute(input: unknown): Promise<unknown>;
  loadOrder(input: unknown): Promise<unknown>;
  loadPayment(input: unknown): Promise<unknown>;
  loadFulfillment(input: unknown): Promise<unknown>;
  loadCustomerCommunications(input: unknown): Promise<unknown>;
  saveEvidence(input: unknown): Promise<unknown>;
  createFinding(input: unknown): Promise<unknown>;
  createEvidenceRequest(input: unknown): Promise<unknown>;
  proposeResolution(input: unknown): Promise<unknown>;
  submitProviderResponse(input: unknown): Promise<unknown>;
}

export function createChargebackToolCatalog(
  ports: ChargebackToolPorts,
): readonly Tool[] {
  return [
    tool(CHARGEBACK_TOOL_NAMES.loadDispute, "Load the dispute record.", ports.loadDispute),
    tool(CHARGEBACK_TOOL_NAMES.loadOrder, "Load the related order.", ports.loadOrder),
    tool(CHARGEBACK_TOOL_NAMES.loadPayment, "Load payment and transaction records.", ports.loadPayment),
    tool(CHARGEBACK_TOOL_NAMES.loadFulfillment, "Load shipment or digital fulfillment evidence.", ports.loadFulfillment),
    tool(
      CHARGEBACK_TOOL_NAMES.loadCustomerCommunications,
      "Load relevant customer communications.",
      ports.loadCustomerCommunications,
    ),
    tool(CHARGEBACK_TOOL_NAMES.saveEvidence, "Persist an evidence record.", ports.saveEvidence),
    tool(CHARGEBACK_TOOL_NAMES.createFinding, "Persist a finding linked to evidence.", ports.createFinding),
    tool(
      CHARGEBACK_TOOL_NAMES.createEvidenceRequest,
      "Request missing evidence from an operator or service.",
      ports.createEvidenceRequest,
    ),
    tool(
      CHARGEBACK_TOOL_NAMES.proposeResolution,
      "Create a resolution proposal for review.",
      ports.proposeResolution,
    ),
    tool(
      CHARGEBACK_TOOL_NAMES.submitProviderResponse,
      "Submit an approved response to the payment provider.",
      ports.submitProviderResponse,
    ),
  ];
}

function tool(
  name: string,
  description: string,
  invoke: (input: unknown) => Promise<unknown>,
): Tool {
  return {
    type: "function",
    name,
    description,
    parameters: {
      type: "object",
      additionalProperties: true,
    },
    strict: false,
    invoke,
  };
}

