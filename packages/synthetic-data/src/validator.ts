import type {
  Dataset,
  Dispute,
  Order,
  OrderItem,
  RefundTransaction,
  SettlementEntry,
  SourceRecord,
  Transaction,
  ValidationError,
  ValidationReport
} from "./schema.js";

const foreignKeys: Record<string, Record<string, string>> = {
  customers: { merchantId: "merchants", sourceSystemId: "source_systems" },
  addresses: { merchantId: "merchants", customerId: "customers" },
  products: { merchantId: "merchants" },
  product_prices: { productId: "products" },
  payment_methods: { customerId: "customers", sourceSystemId: "source_systems", billingAddressId: "addresses" },
  orders: { merchantId: "merchants", customerId: "customers", sourceSystemId: "source_systems", billingAddressId: "addresses", shippingAddressId: "addresses" },
  order_items: { orderId: "orders", productId: "products", productPriceId: "product_prices" },
  order_policy_acceptances: { orderId: "orders", policyVersionId: "policy_versions", sourceSystemId: "source_systems" },
  payments: { merchantId: "merchants", orderId: "orders", customerId: "customers", paymentMethodId: "payment_methods", sourceSystemId: "source_systems" },
  transactions: { paymentId: "payments", parentTransactionId: "transactions", sourceSystemId: "source_systems" },
  payment_authentications: { paymentId: "payments", sourceSystemId: "source_systems" },
  refunds: { paymentId: "payments", captureTransactionId: "transactions", sourceSystemId: "source_systems" },
  refund_transactions: { refundId: "refunds", transactionId: "transactions" },
  settlement_entries: { transactionId: "transactions", sourceSystemId: "source_systems" },
  shipments: { orderId: "orders", sourceSystemId: "source_systems", destinationAddressId: "addresses" },
  shipment_items: { shipmentId: "shipments", orderItemId: "order_items" },
  shipment_events: { shipmentId: "shipments" },
  delivery_confirmations: { shipmentId: "shipments", shipmentEventId: "shipment_events", deliveredAddressId: "addresses", sourceDocumentId: "source_documents" },
  returns: { orderId: "orders", customerId: "customers" },
  return_items: { returnId: "returns", orderItemId: "order_items" },
  conversations: { merchantId: "merchants", customerId: "customers", orderId: "orders", sourceSystemId: "source_systems" },
  messages: { conversationId: "conversations" },
  message_attachments: { messageId: "messages", sourceDocumentId: "source_documents" },
  policies: { merchantId: "merchants" },
  policy_versions: { policyId: "policies", sourceDocumentId: "source_documents" },
  policy_clauses: { policyVersionId: "policy_versions" },
  disputes: { merchantId: "merchants", paymentId: "payments", transactionId: "transactions", reasonCodeId: "dispute_reason_codes", requirementSetId: "dispute_requirement_sets", sourceSystemId: "source_systems" },
  dispute_items: { disputeId: "disputes", orderItemId: "order_items" },
  dispute_events: { disputeId: "disputes" },
  dispute_requirement_sets: { reasonCodeId: "dispute_reason_codes", sourceSystemId: "source_systems" },
  dispute_requirements: { requirementSetId: "dispute_requirement_sets" },
  source_documents: { merchantId: "merchants", sourceSystemId: "source_systems" }
};

const monetaryFields = /(?:amount|subtotal|discount|tax|shipping|total|fee|price)Minor$/;
const timestampFields = /(?:At|edAt|Date)$/;

function addError(errors: ValidationError[], entity: string, record: SourceRecord | undefined, field: string | null, reason: string) {
  errors.push({ entity, recordId: record?.id ?? null, field, reason });
}

export function validateDataset(dataset: Dataset): ValidationReport {
  const errors: ValidationError[] = [];
  const indexes = new Map<string, Set<string>>();

  for (const [entity, records] of Object.entries(dataset)) {
    const ids = new Set<string>();
    indexes.set(entity, ids);
    for (const record of records) {
      if (!record || typeof record !== "object" || typeof record.id !== "string" || record.id.length === 0) {
        addError(errors, entity, record, "id", "Every record must have a non-empty string id.");
        continue;
      }
      if (ids.has(record.id)) addError(errors, entity, record, "id", "Primary key is not unique.");
      ids.add(record.id);
      for (const [field, value] of Object.entries(record)) {
        if (monetaryFields.test(field) && (!Number.isInteger(value) || (value as number) < 0)) {
          addError(errors, entity, record, field, "Monetary values must be non-negative integer minor units.");
        }
        if (timestampFields.test(field) && value !== null && (typeof value !== "string" || Number.isNaN(Date.parse(value)))) {
          addError(errors, entity, record, field, "Timestamp must be an ISO-8601 value.");
        }
      }
    }
  }

  for (const [entity, fields] of Object.entries(foreignKeys)) {
    for (const record of dataset[entity] ?? []) {
      for (const [field, target] of Object.entries(fields)) {
        const value = (record as unknown as Record<string, unknown>)[field];
        if (value !== null && value !== undefined && !indexes.get(target)?.has(String(value))) {
          addError(errors, entity, record, field, `Referenced ${target} record does not exist.`);
        }
      }
    }
  }

  for (const order of (dataset.orders ?? []) as Order[]) {
    const items = (dataset.order_items as OrderItem[] | undefined ?? []).filter((item) => item.orderId === order.id);
    const subtotal = items.reduce((sum, item) => sum + item.subtotalMinor, 0);
    if (subtotal !== order.subtotalMinor) addError(errors, "orders", order, "subtotalMinor", "Order subtotal must equal the sum of item subtotals.");
    if (order.totalMinor !== order.subtotalMinor - order.discountMinor + order.taxMinor + order.shippingMinor) {
      addError(errors, "orders", order, "totalMinor", "Order total arithmetic is invalid.");
    }
  }

  for (const item of (dataset.order_items ?? []) as OrderItem[]) {
    if (item.subtotalMinor !== item.quantity * item.unitPriceMinor) addError(errors, "order_items", item, "subtotalMinor", "Item subtotal must equal quantity multiplied by unit price.");
    if (item.totalMinor !== item.subtotalMinor - item.discountMinor + item.taxMinor) addError(errors, "order_items", item, "totalMinor", "Item total arithmetic is invalid.");
  }

  for (const entry of (dataset.settlement_entries as SettlementEntry[] | undefined ?? [])) {
    if (entry.netAmountMinor !== entry.grossAmountMinor - entry.feeAmountMinor) addError(errors, "settlement_entries", entry, "netAmountMinor", "Net settlement must equal gross amount minus fee.");
  }

  for (const transaction of (dataset.transactions ?? []) as Transaction[]) {
    if (transaction.type === "REFUND" && transaction.status === "SUCCEEDED") {
      const refundLink = (dataset.refund_transactions as RefundTransaction[] | undefined ?? []).find((link) => link.transactionId === transaction.id);
      if (!refundLink) addError(errors, "transactions", transaction, "id", "Successful refund transactions must be linked to a refund.");
    }
  }

  for (const dispute of (dataset.disputes ?? []) as Dispute[]) {
    const capture = (dataset.transactions ?? []).find((transaction) => transaction.id === dispute.transactionId) as Transaction | undefined;
    if (!capture || capture.type !== "CAPTURE" || capture.status !== "SUCCEEDED") addError(errors, "disputes", dispute, "transactionId", "Dispute must reference a successful capture transaction.");
    if (capture && dispute.amountMinor > capture.amountMinor) addError(errors, "disputes", dispute, "amountMinor", "Dispute amount cannot exceed the referenced capture amount.");
  }

  return { valid: errors.length === 0, errors };
}
