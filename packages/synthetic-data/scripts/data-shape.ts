/** The JSONL entity contract used by the deterministic data generator. */
export interface SyntheticRecord {
  id: string;
  [field: string]: unknown;
}

export interface SyntheticDataShape {
  source: Record<string, SyntheticRecord[]>;
  investigation: Record<string, SyntheticRecord[]>;
  evaluation: SyntheticRecord[];
}

export const SOURCE_ENTITIES = [
  "source_systems", "merchants", "customers", "addresses", "products", "product_prices", "payment_methods", "orders", "order_items", "order_policy_acceptances", "payments", "transactions", "payment_authentications", "refunds", "refund_transactions", "settlement_entries", "shipments", "shipment_items", "shipment_events", "delivery_confirmations", "returns", "return_items", "digital_fulfillment_events", "conversations", "messages", "message_attachments", "policies", "policy_versions", "policy_clauses", "dispute_reason_codes", "disputes", "dispute_items", "dispute_events", "dispute_requirement_sets", "dispute_requirements", "source_documents"
] as const;

export const INVESTIGATION_ENTITIES = [
  "investigation_runs", "agent_executions", "evidence", "evidence_source_references", "findings", "finding_evidence", "finding_verifications", "contradictions", "contradiction_evidence", "evidence_requests", "resolutions", "resolution_findings"
] as const;
