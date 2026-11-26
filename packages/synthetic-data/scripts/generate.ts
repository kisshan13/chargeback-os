import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { INVESTIGATION_ENTITIES, SOURCE_ENTITIES, type SyntheticRecord } from "./data-shape.js";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = join(packageRoot, "data", "source");
const evaluationRoot = join(packageRoot, "data", "evaluation");
const referenceDate = "2026-11-01T00:00:00.000Z";
const seed = 20261101;

type JsonRecord = SyntheticRecord;
type JsonDataset = Record<string, SyntheticRecord[]>;

class Rng {
  private state: number;

  constructor(initialSeed: number) {
    this.state = initialSeed >>> 0;
  }

  next(): number {
    this.state = (1664525 * this.state + 1013904223) >>> 0;
    return this.state / 0x100000000;
  }

  pick<T>(values: readonly T[]): T {
    return values[Math.floor(this.next() * values.length)] as T;
  }
}

const rng = new Rng(seed);
const dataset: JsonDataset = {};
const outcomes: JsonRecord[] = [];
const counters = new Map<string, number>();

function id(prefix: string): string {
  const next = (counters.get(prefix) ?? 0) + 1;
  counters.set(prefix, next);
  return `${prefix}-${String(next).padStart(6, "0")}`;
}

function add(entity: string, record: JsonRecord): string {
  (dataset[entity] ??= []).push(record);
  return String(record.id);
}

function at(day: number, hour = 9): string {
  return new Date(Date.parse(referenceDate) + day * 86_400_000 + hour * 3_600_000).toISOString();
}

function checksum(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function documentRecord(merchantId: string, sourceSystemId: string, name: string, type: string, day: number): string {
  const documentId = id("DOC");
  const content = `Synthetic document ${documentId}: ${name}`;
  return add("source_documents", {
    id: documentId,
    merchantId,
    sourceSystemId,
    externalId: `doc_${documentId.toLowerCase()}`,
    name,
    type,
    mimeType: "text/plain",
    storagePath: `documents/${documentId}.txt`,
    checksum: checksum(content),
    createdAt: at(day, 10)
  });
}

const systems = [
  ["PAYMENT", "Simulated Stripe", "Stripe-like Payments"],
  ["COMMERCE", "Simulated Shopify", "Shopify-like Commerce"],
  ["FULFILLMENT", "Simulated ParcelPost", "ParcelPost"],
  ["COMMUNICATION", "Simulated Helpdesk", "Helpdesk"],
  ["POLICY", "ChargebackOS Policy Store", "ChargebackOS"]
] as const;

for (const [type, name, provider] of systems) {
  add("source_systems", { id: id("SYS"), name, type, provider, isSynthetic: true, createdAt: at(-90) });
}

const paymentSystemId = dataset.source_systems[0]!.id as string;
const commerceSystemId = dataset.source_systems[1]!.id as string;
const fulfillmentSystemId = dataset.source_systems[2]!.id as string;
const communicationSystemId = dataset.source_systems[3]!.id as string;
const policySystemId = dataset.source_systems[4]!.id as string;
const merchantId = add("merchants", {
  id: id("MER"),
  name: "Northstar Outfitters",
  legalName: "Northstar Outfitters Synthetic LLC",
  industry: "APPAREL",
  country: "US",
  defaultCurrency: "USD",
  website: "https://northstar.example.test",
  status: "ACTIVE",
  createdAt: at(-90)
});

const firstNames = ["Avery", "Jordan", "Morgan", "Riley", "Taylor", "Casey", "Quinn", "Parker", "Jamie", "Cameron"];
const lastNames = ["Reed", "Patel", "Nguyen", "Brooks", "Morgan", "Rivera", "Bell", "Shaw", "Chen", "Diaz"];
const customerAddresses = new Map<string, { billing: string; shipping: string }>();

for (let index = 0; index < 50; index += 1) {
  const customerId = id("CUS");
  const firstName = firstNames[index % firstNames.length]!;
  const lastName = lastNames[(index * 3) % lastNames.length]!;
  add("customers", {
    id: customerId,
    merchantId,
    externalId: `cus_shop_${String(index + 1).padStart(5, "0")}`,
    sourceSystemId: commerceSystemId,
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index + 1}@example.test`,
    phone: index % 7 === 0 ? null : `+1-555-010-${String(index + 1).padStart(4, "0")}`,
    status: "ACTIVE",
    createdAt: at(-80 + index)
  });
  const billing = add("addresses", {
    id: id("ADD"), merchantId, customerId, recipientName: `${firstName} ${lastName}`,
    addressLine1: `${100 + index} Market Street`, addressLine2: null, city: "Austin", state: "TX", postalCode: `787${String(index % 90).padStart(2, "0")}`, country: "US", createdAt: at(-80 + index)
  });
  const shipping = add("addresses", {
    id: id("ADD"), merchantId, customerId, recipientName: `${firstName} ${lastName}`,
    addressLine1: `${200 + index} Congress Avenue`, addressLine2: index % 4 === 0 ? `Unit ${index + 1}` : null, city: "Austin", state: "TX", postalCode: `787${String((index + 10) % 90).padStart(2, "0")}`, country: "US", createdAt: at(-70 + index)
  });
  customerAddresses.set(customerId, { billing, shipping });
}

const productNames = ["Trail Jacket", "Everyday Backpack", "Merino Base Layer", "Canvas Weekender", "Insulated Bottle", "Wool Beanie", "Running Shorts", "Travel Organizer", "Rain Shell", "Hiking Socks", "Desk Lamp", "Field Notebook", "Camp Mug", "Packing Cubes", "Linen Shirt", "Digital Trail Guide", "Gift Card", "Warranty Plan", "Video Course", "Virtual Fitting"];
const productIds: string[] = [];
const productPriceIds: string[] = [];
for (let index = 0; index < 25; index += 1) {
  const productId = add("products", {
    id: id("PRD"), merchantId, sku: `NS-${String(index + 1).padStart(4, "0")}`, name: productNames[index % productNames.length]!,
    description: `Northstar ${productNames[index % productNames.length]!.toLowerCase()} with synthetic catalog details.`,
    type: index >= 20 ? (index % 2 === 0 ? "DIGITAL" : "SERVICE") : "PHYSICAL", status: "ACTIVE", createdAt: at(-75 + index)
  });
  productIds.push(productId);
  const priceId = add("product_prices", { id: id("PPR"), productId, amountMinor: 2500 + index * 725, currency: "USD", effectiveFrom: at(-70 + index), effectiveUntil: null });
  productPriceIds.push(priceId);
  if (index < 5) add("product_prices", { id: id("PPR"), productId, amountMinor: 2200 + index * 725, currency: "USD", effectiveFrom: at(-160), effectiveUntil: at(-70 + index) });
}

const policyIds: string[] = [];
const policyTypes = ["REFUND", "RETURN", "SHIPPING", "CANCELLATION", "TERMS_OF_SERVICE"];
for (let index = 0; index < 5; index += 1) {
  const policyId = add("policies", { id: id("POL"), merchantId, name: `${policyTypes[index]} policy`, type: policyTypes[index], createdAt: at(-85) });
  policyIds.push(policyId);
  for (let version = 1; version <= (index < 3 ? 2 : 1); version += 1) {
    const versionId = add("policy_versions", {
      id: id("PLV"), policyId, version, content: `${policyTypes[index]} policy version ${version}. Returns are accepted within ${14 + version * 2} days when eligibility requirements are met.`,
      sourceDocumentId: documentRecord(merchantId, policySystemId, `${policyTypes[index]} policy v${version}`, "POLICY", -85 + version),
      effectiveFrom: at(-85 + (version - 1) * 30), effectiveUntil: version === 2 ? null : at(-55), createdAt: at(-85 + (version - 1) * 30)
    });
    add("policy_clauses", { id: id("PLC"), policyVersionId: versionId, section: "1.1", title: "Eligibility", content: "The original purchase record and the applicable version determine eligibility." });
    add("policy_clauses", { id: id("PLC"), policyVersionId: versionId, section: "1.2", title: "Processing", content: "Approved refunds are processed through the payment provider." });
  }
}

const paymentMethodsByCustomer = new Map<string, string>();
for (let index = 0; index < 60; index += 1) {
  const customerId = dataset.customers[index % 50]!.id as string;
  const methodId = add("payment_methods", {
    id: id("PMT"), customerId, sourceSystemId: paymentSystemId, externalId: `pm_sim_${String(index + 1).padStart(5, "0")}`,
    type: "CARD", network: rng.pick(["VISA", "MASTERCARD", "AMEX", "DISCOVER"]), lastFour: String(1000 + ((index * 137) % 8999)), fingerprint: `fp_${String(index + 1).padStart(8, "0")}`,
    billingAddressId: customerAddresses.get(customerId)!.billing, createdAt: at(-65 + index)
  });
  paymentMethodsByCustomer.set(customerId, methodId);
}

const orderIds: string[] = [];
const orderItemIdsByOrder = new Map<string, string[]>();
const orderTotalByOrder = new Map<string, number>();
const paymentIdsByOrder = new Map<string, string[]>();
const captureIdsByPayment = new Map<string, string>();
const invoiceIdsByOrder = new Map<string, string>();

for (let index = 0; index < 100; index += 1) {
  const customerId = dataset.customers[index % 50]!.id as string;
  const address = customerAddresses.get(customerId)!;
  const orderId = id("ORD");
  const itemIds: string[] = [];
  let subtotalMinor = 0;
  const itemCount = index % 3 === 0 ? 2 : 1;
  for (let itemIndex = 0; itemIndex < itemCount; itemIndex += 1) {
    const productIndex = (index * 3 + itemIndex) % productIds.length;
    const quantity = index === 8 && itemIndex === 1 ? 2 : 1;
    const unitPriceMinor = 2500 + productIndex * 725;
    const itemSubtotal = quantity * unitPriceMinor;
    subtotalMinor += itemSubtotal;
    itemIds.push(add("order_items", {
      id: id("ORI"), orderId, productId: productIds[productIndex]!, productPriceId: productPriceIds[productIndex]!,
      productName: productNames[productIndex % productNames.length]!, productDescription: `Purchase-time description for ${productNames[productIndex % productNames.length]!.toLowerCase()}.`,
      quantity, unitPriceMinor, subtotalMinor: itemSubtotal, discountMinor: 0, taxMinor: Math.round(itemSubtotal * 0.1), totalMinor: itemSubtotal + Math.round(itemSubtotal * 0.1), currency: "USD"
    }));
  }
  const discountMinor = index % 10 === 0 ? 500 : 0;
  const taxMinor = Math.round(subtotalMinor * 0.1);
  const shippingMinor = subtotalMinor >= 10000 ? 0 : 799;
  const totalMinor = subtotalMinor - discountMinor + taxMinor + shippingMinor;
  add("orders", {
    id: orderId, merchantId, customerId, sourceSystemId: commerceSystemId, externalId: `order_sim_${String(index + 1).padStart(5, "0")}`,
    billingAddressId: address.billing, shippingAddressId: address.shipping, currency: "USD", subtotalMinor, discountMinor, taxMinor, shippingMinor, totalMinor,
    status: "COMPLETED", placedAt: at(-60 + index % 45), canceledAt: null
  });
  orderIds.push(orderId);
  orderItemIdsByOrder.set(orderId, itemIds);
  orderTotalByOrder.set(orderId, totalMinor);
  invoiceIdsByOrder.set(orderId, documentRecord(merchantId, commerceSystemId, `Invoice ${orderId}`, "INVOICE", -60 + index % 45));
  add("order_policy_acceptances", { id: id("OPA"), orderId, policyVersionId: dataset.policy_versions[index % dataset.policy_versions.length]!.id, acceptanceMethod: "CHECKBOX", acceptedAt: at(-60 + index % 45, 8), sourceSystemId: commerceSystemId });
}

function addPayment(orderIndex: number, suffix = ""): string {
  const orderId = orderIds[orderIndex]!;
  const order = dataset.orders.find((record) => record.id === orderId)!;
  const customerId = order.customerId as string;
  const paymentId = add("payments", {
    id: id("PAY"), merchantId, orderId, customerId, paymentMethodId: paymentMethodsByCustomer.get(customerId)!, sourceSystemId: paymentSystemId,
    externalId: `pay_sim_${String(orderIndex + 1).padStart(5, "0")}${suffix}`, amountMinor: order.totalMinor, currency: "USD", status: "CAPTURED", idempotencyKey: suffix ? null : `idem_${orderId}`, createdAt: at(-60 + orderIndex % 45, 9)
  });
  const authorizationId = add("transactions", { id: id("TXN"), paymentId, parentTransactionId: null, sourceSystemId: paymentSystemId, externalId: `auth_${paymentId}`, type: "AUTHORIZATION", amountMinor: order.totalMinor, currency: "USD", status: "SUCCEEDED", failureCode: null, occurredAt: at(-60 + orderIndex % 45, 9) });
  const captureId = add("transactions", { id: id("TXN"), paymentId, parentTransactionId: authorizationId, sourceSystemId: paymentSystemId, externalId: `capture_${paymentId}`, type: "CAPTURE", amountMinor: order.totalMinor, currency: "USD", status: "SUCCEEDED", failureCode: null, occurredAt: at(-60 + orderIndex % 45, 9, ) });
  const settlementId = add("transactions", { id: id("TXN"), paymentId, parentTransactionId: captureId, sourceSystemId: paymentSystemId, externalId: `settlement_${paymentId}`, type: "SETTLEMENT", amountMinor: order.totalMinor, currency: "USD", status: "SUCCEEDED", failureCode: null, occurredAt: at(-59 + orderIndex % 45, 12) });
  add("settlement_entries", { id: id("SET"), transactionId: settlementId, sourceSystemId: paymentSystemId, grossAmountMinor: order.totalMinor, feeAmountMinor: Math.round(order.totalMinor * 0.029) + 30, netAmountMinor: order.totalMinor - (Math.round(order.totalMinor * 0.029) + 30), currency: "USD", settledAt: at(-59 + orderIndex % 45, 12) });
  if (orderIndex !== 10) add("payment_authentications", { id: id("AUT"), paymentId, sourceSystemId: paymentSystemId, method: orderIndex === 4 ? "NONE" : "THREE_DS", status: "SUCCEEDED", deviceFingerprint: `device_${String(orderIndex % 15).padStart(3, "0")}`, ipAddress: `198.51.100.${(orderIndex % 200) + 1}`, addressVerificationResult: "MATCH", authenticatedAt: at(-60 + orderIndex % 45, 9) });
  captureIdsByPayment.set(paymentId, captureId);
  const paymentIds = paymentIdsByOrder.get(orderId) ?? [];
  paymentIds.push(paymentId);
  paymentIdsByOrder.set(orderId, paymentIds);
  return paymentId;
}

for (let index = 0; index < 100; index += 1) {
  addPayment(index);
  if (index === 3) addPayment(index, "_retry");
}

function addRefund(orderIndex: number, status: string, amountMinor: number): string {
  const orderId = orderIds[orderIndex]!;
  const paymentId = paymentIdsByOrder.get(orderId)![0]!;
  const captureId = captureIdsByPayment.get(paymentId)!;
  const refundId = add("refunds", { id: id("RFD"), paymentId, captureTransactionId: captureId, sourceSystemId: paymentSystemId, externalId: `refund_sim_${String(orderIndex + 1).padStart(5, "0")}`, amountMinor, currency: "USD", reason: "CUSTOMER_REQUEST", status, requestedAt: at(-35 + orderIndex, 11), completedAt: status === "SUCCEEDED" ? at(-34 + orderIndex, 14) : null });
  const transactionStatus = status === "SUCCEEDED" ? "SUCCEEDED" : status === "PROCESSING" ? "PENDING" : "FAILED";
  const refundTransactionId = add("transactions", { id: id("TXN"), paymentId, parentTransactionId: captureId, sourceSystemId: paymentSystemId, externalId: `refund_txn_${refundId}`, type: "REFUND", amountMinor, currency: "USD", status: transactionStatus, failureCode: transactionStatus === "FAILED" ? "PROVIDER_DECLINED" : null, occurredAt: at(-34 + orderIndex, 14) });
  add("refund_transactions", { id: id("RFT"), refundId, transactionId: refundTransactionId });
  const payment = dataset.payments.find((record) => record.id === paymentId)!;
  if (status === "SUCCEEDED") payment.status = amountMinor === payment.amountMinor ? "REFUNDED" : "PARTIALLY_REFUNDED";
  return refundId;
}

const refunds = new Map<number, string>();
refunds.set(5, addRefund(5, "FAILED", orderTotalByOrder.get(orderIds[5]!)!));
refunds.set(6, addRefund(6, "SUCCEEDED", orderTotalByOrder.get(orderIds[6]!)!));
refunds.set(7, addRefund(7, "PROCESSING", orderTotalByOrder.get(orderIds[7]!)!));
refunds.set(14, addRefund(14, "SUCCEEDED", Math.floor(orderTotalByOrder.get(orderIds[14]!)! / 2)));

function addShipment(orderIndex: number, itemIds: string[], suffix = ""): string {
  const orderId = orderIds[orderIndex]!;
  const order = dataset.orders.find((record) => record.id === orderId)!;
  const shipmentId = add("shipments", { id: id("SHP"), orderId, sourceSystemId: fulfillmentSystemId, destinationAddressId: order.shippingAddressId, trackingNumber: `NS${String(orderIndex + 1).padStart(10, "0")}${suffix}`, carrier: "ParcelPost", status: orderIndex === 2 ? "IN_TRANSIT" : "DELIVERED", createdAt: at(-58 + orderIndex % 45, 10), shippedAt: at(-57 + orderIndex % 45, 10), estimatedDeliveryAt: at(-53 + orderIndex % 45, 18) });
  for (const itemId of itemIds) add("shipment_items", { id: id("SHI"), shipmentId, orderItemId: itemId, quantity: 1 });
  add("shipment_events", { id: id("SHE"), shipmentId, externalId: `event_pickup_${shipmentId}`, type: "PICKUP", location: "Austin, TX", description: "Package accepted by carrier.", occurredAt: at(-57 + orderIndex % 45, 11), recordedAt: at(-57 + orderIndex % 45, 12) });
  add("shipment_events", { id: id("SHE"), shipmentId, externalId: `event_transit_${shipmentId}`, type: "IN_TRANSIT", location: "Dallas, TX", description: "Package moving through carrier network.", occurredAt: at(-55 + orderIndex % 45, 9), recordedAt: at(-55 + orderIndex % 45, 10) });
  const deliveredEventId = add("shipment_events", { id: id("SHE"), shipmentId, externalId: `event_delivery_${shipmentId}`, type: orderIndex === 2 ? "DELIVERY_ATTEMPT" : "DELIVERED", location: "Austin, TX", description: orderIndex === 2 ? "Delivery evidence is unavailable; delivery attempt recorded." : "Package delivered.", occurredAt: at(-53 + orderIndex % 45, 16), recordedAt: at(-53 + orderIndex % 45, 17) });
  if (orderIndex !== 2) {
    const wrongAddress = orderIndex === 1 ? add("addresses", { id: id("ADD"), merchantId, customerId: null, recipientName: "Unverified recipient", addressLine1: "999 Example Road", addressLine2: null, city: "Austin", state: "TX", postalCode: "78799", country: "US", createdAt: at(-52) }) : order.shippingAddressId;
    const deliveryDoc = documentRecord(merchantId, fulfillmentSystemId, `Delivery confirmation ${shipmentId}`, "DELIVERY_SIGNATURE", -53 + orderIndex % 45);
    add("delivery_confirmations", { id: id("DLC"), shipmentId, shipmentEventId: deliveredEventId, deliveredAddressId: wrongAddress, recipientName: orderIndex === 1 ? "Unverified recipient" : order.customerId, confirmationMethod: orderIndex === 1 ? "PHOTO" : "SIGNATURE", sourceDocumentId: deliveryDoc, deliveredAt: at(-53 + orderIndex % 45, 16) });
  }
  return shipmentId;
}

for (let index = 0; index < 100; index += 1) {
  const itemIds = orderItemIdsByOrder.get(orderIds[index]!)!;
  if (index === 8) addShipment(index, [itemIds[0]!]);
  else if (index === 9) { addShipment(index, [itemIds[0]!], "_A"); addShipment(index, itemIds.slice(1), "_B"); }
  else addShipment(index, itemIds);
}

for (let index = 0; index < 60; index += 1) {
  const orderId = orderIds[index]!;
  const order = dataset.orders.find((record) => record.id === orderId)!;
  const conversationId = add("conversations", { id: id("CON"), merchantId, customerId: order.customerId, orderId, sourceSystemId: communicationSystemId, externalId: `case_${String(index + 1).padStart(5, "0")}`, channel: index % 3 === 0 ? "EMAIL" : index % 3 === 1 ? "LIVE_CHAT" : "SUPPORT_TICKET", subject: `Question about ${order.externalId}`, status: "CLOSED", createdAt: at(-30 + index % 20, 13) });
  add("messages", { id: id("MSG"), conversationId, externalId: `msg_${conversationId}_1`, senderType: "CUSTOMER", senderId: order.customerId, body: index === 5 ? "The refund was promised, but I do not see it yet." : "Please help me with this order.", sentAt: at(-30 + index % 20, 13) });
  add("messages", { id: id("MSG"), conversationId, externalId: `msg_${conversationId}_2`, senderType: "MERCHANT", senderId: merchantId, body: index === 5 ? "We have submitted the refund request." : "We are reviewing the order details.", sentAt: at(-30 + index % 20, 14) });
  add("messages", { id: id("MSG"), conversationId, externalId: `msg_${conversationId}_3`, senderType: "SYSTEM", senderId: communicationSystemId, body: "Conversation closed by the support workflow.", sentAt: at(-30 + index % 20, 15) });
}

const reasonDefinitions = [
  ["PRODUCT_NOT_RECEIVED", "Product not received", "Customer reports non-delivery."],
  ["PRODUCT_NOT_AS_DESCRIBED", "Product not as described", "Customer reports incorrect product information."],
  ["DUPLICATE_CHARGE", "Duplicate charge", "Customer reports multiple charges."],
  ["REFUND_NOT_RECEIVED", "Refund not received", "Customer reports a missing refund."],
  ["UNAUTHORIZED_TRANSACTION", "Unauthorized transaction", "Customer reports an unauthorized payment."],
  ["SUBSCRIPTION_CANCELED", "Subscription canceled", "Customer reports billing after cancellation."]
] as const;
const reasonIds = new Map<string, string>();
for (const [code, name, description] of reasonDefinitions) reasonIds.set(code, add("dispute_reason_codes", { id: id("DRC"), code, name, description }));

const requirementSets = new Map<string, string>();
const requirementsByCode: Record<string, [string, string, boolean][]> = {
  PRODUCT_NOT_RECEIVED: [["PAYMENT", "Original payment record", true], ["ORDER", "Original order and order items", true], ["DELIVERY_CONFIRMATION", "Delivery confirmation", true], ["CUSTOMER_COMMUNICATION", "Customer communications", false]],
  PRODUCT_NOT_AS_DESCRIBED: [["PAYMENT", "Original payment record", true], ["PRODUCT_DESCRIPTION", "Purchase-time product description", true], ["CUSTOMER_COMMUNICATION", "Customer complaint", true], ["RETURN_RECORDS", "Return records", false]],
  DUPLICATE_CHARGE: [["CAPTURE_TRANSACTIONS", "Successful capture transactions", true], ["ORDER", "Original order amount", true], ["REFUND_HISTORY", "Refund history", true]],
  REFUND_NOT_RECEIVED: [["REFUND_HISTORY", "Refund request and transaction history", true], ["CUSTOMER_COMMUNICATION", "Merchant communications", false]],
  UNAUTHORIZED_TRANSACTION: [["PAYMENT", "Original payment record", true], ["AUTHENTICATION", "Payment authentication records", true]],
  SUBSCRIPTION_CANCELED: [["PAYMENT", "Original payment record", true], ["CUSTOMER_COMMUNICATION", "Cancellation communications", true]]
};
for (const [code, reasonCodeId] of reasonIds) {
  const requirementSetId = add("dispute_requirement_sets", { id: id("DRS"), reasonCodeId, sourceSystemId: paymentSystemId, version: 1, effectiveFrom: at(-100), effectiveUntil: null, isSynthetic: true });
  requirementSets.set(code, requirementSetId);
  for (const [evidenceCategory, description, required] of requirementsByCode[code]!) add("dispute_requirements", { id: id("DRQ"), requirementSetId, evidenceCategory, description, required });
}

const scenarios = [
  ["CONFIRMED_DELIVERY", "PRODUCT_NOT_RECEIVED", "CONTEST", null, "Delivery signature and address-matched confirmation support the merchant."],
  ["INCORRECT_DELIVERY", "PRODUCT_NOT_RECEIVED", "ACCEPT", null, "Carrier evidence reports delivery to an address different from the intended destination."],
  ["MISSING_DELIVERY_EVIDENCE", "PRODUCT_NOT_RECEIVED", "COLLECT_EVIDENCE", null, "A shipment exists but no delivery confirmation is available."],
  ["DUPLICATE_PAYMENT", "DUPLICATE_CHARGE", "ACCEPT", null, "Two successful captures exist for the purchase and neither was refunded."],
  ["APPARENT_DUPLICATE", "DUPLICATE_CHARGE", "CONTEST", null, "Authorization and capture are separate lifecycle records, not duplicate charges."],
  ["FAILED_REFUND", "REFUND_NOT_RECEIVED", "ACCEPT", null, "The refund request and its provider transaction both failed."],
  ["SUCCESSFUL_REFUND", "REFUND_NOT_RECEIVED", "CONTEST", null, "A successful refund transaction predates the dispute."],
  ["PENDING_REFUND", "REFUND_NOT_RECEIVED", "COLLECT_EVIDENCE", null, "The refund remains processing with no final outcome."],
  ["PARTIAL_SHIPMENT", "PRODUCT_NOT_RECEIVED", "ACCEPT", null, "Only part of the disputed order quantity was shipped."],
  ["COMPLETE_SPLIT_SHIPMENT", "PRODUCT_NOT_RECEIVED", "CONTEST", null, "Multiple shipments collectively cover the order items."],
  ["MISSING_AUTHENTICATION", "UNAUTHORIZED_TRANSACTION", "COLLECT_EVIDENCE", null, "The payment has no authentication record to establish authorization."],
  ["INCORRECT_PRODUCT_DESCRIPTION", "PRODUCT_NOT_AS_DESCRIBED", "ACCEPT", null, "The preserved purchase-time description supports the customer claim."],
  ["POLICY_VERSION_CONFLICT", "PRODUCT_NOT_AS_DESCRIBED", "COLLECT_EVIDENCE", null, "The accepted historical policy differs from the current policy version."],
  ["INCORRECT_RECEIPT_REFERENCE", "PRODUCT_NOT_RECEIVED", "COLLECT_EVIDENCE", null, "The merchant receipt supplied for review belongs to another order."],
  ["WRONG_REFUND_AMOUNT", "REFUND_NOT_RECEIVED", "ACCEPT", null, "The successful refund covers only part of the amount owed."]
] as const;

for (let index = 0; index < scenarios.length; index += 1) {
  const [scenarioType, reasonCode, recommendation, , explanation] = scenarios[index]!;
  const orderId = orderIds[index]!;
  const paymentId = paymentIdsByOrder.get(orderId)![0]!;
  const captureId = captureIdsByPayment.get(paymentId)!;
  const orderAmount = orderTotalByOrder.get(orderId)!;
  const disputeId = add("disputes", {
    id: id("DSP"), merchantId, paymentId, transactionId: captureId, reasonCodeId: reasonIds.get(reasonCode)!, requirementSetId: requirementSets.get(reasonCode)!, sourceSystemId: paymentSystemId,
    externalId: `dispute_sim_${String(index + 1).padStart(5, "0")}`, customerClaim: explanation, amountMinor: orderAmount, currency: "USD", providerStatus: "NEEDS_RESPONSE", createdAt: at(-20 + index, 10), responseDeadline: at(10 + index, 17)
  });
  add("dispute_events", { id: id("DSE"), disputeId, externalId: `dispute_event_${disputeId}`, type: "CREATED", previousStatus: null, newStatus: "NEEDS_RESPONSE", occurredAt: at(-20 + index, 10), recordedAt: at(-20 + index, 10, ) });
  const refs = [orderId, captureId];
  if (index === 3) refs.push(captureIdsByPayment.get(paymentIdsByOrder.get(orderId)![1]!)!);
  if (index === 14) refs.push(refunds.get(14)!);
  outcomes.push({ id: `OUT-${String(index + 1).padStart(6, "0")}`, disputeId, scenarioType, expectedRecommendation: recommendation, expectedFinancialAmountMinor: index === 3 || index === 14 ? (index === 3 ? orderAmount : Math.floor(orderAmount / 2)) : null, currency: "USD", expectedSourceReferences: refs, expectedContradictions: index === 1 || index === 4 || index === 12 || index === 13 ? [explanation] : [], expectedMissingEvidence: index === 2 || index === 7 || index === 10 ? [index === 2 ? "delivery_confirmations" : index === 7 ? "final_refund_transaction" : "payment_authentications"] : [], explanation });
}

function jsonl(records: JsonRecord[]): string {
  return records.length === 0 ? "" : `${records.map((record) => JSON.stringify(record)).join("\n")}\n`;
}

const sourceChecksums: Record<string, string> = {};
await mkdir(sourceRoot, { recursive: true });
await mkdir(evaluationRoot, { recursive: true });
for (const entity of SOURCE_ENTITIES) {
  const records = dataset[entity] ?? [];
  const content = jsonl(records);
  const fileName = `${entity}.jsonl`;
  await writeFile(join(sourceRoot, fileName), content, "utf8");
  sourceChecksums[`source/${fileName}`] = checksum(content);
}
const investigationRoot = join(packageRoot, "data", "investigation");
await mkdir(investigationRoot, { recursive: true });
for (const entity of INVESTIGATION_ENTITIES) await writeFile(join(investigationRoot, `${entity}.jsonl`), "", "utf8");
const evaluationContent = jsonl(outcomes);
await writeFile(join(evaluationRoot, "expected_outcomes.jsonl"), evaluationContent, "utf8");
sourceChecksums["evaluation/expected_outcomes.jsonl"] = checksum(evaluationContent);

const recordCounts = Object.fromEntries(SOURCE_ENTITIES.map((entity) => [entity, (dataset[entity] ?? []).length]));
await writeFile(join(packageRoot, "data", "manifest.json"), `${JSON.stringify({ datasetId: "chargebackos-demo-001", version: "1.0.0", schemaVersion: "1.0.0", generatorVersion: "1.0.0", seed, generatedAt: referenceDate, referenceDate, recordCounts, checksums: sourceChecksums, isSynthetic: true }, null, 2)}\n`, "utf8");
console.log(`Generated ${Object.values(recordCounts).reduce((sum, count) => sum + count, 0)} source records and ${outcomes.length} evaluation outcomes.`);
