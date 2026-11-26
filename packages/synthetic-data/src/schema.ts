export type Id = string;
export type IsoDate = string;
export type Currency = string;

export interface BaseRecord {
  id: Id;
}

export interface SourceSystem extends BaseRecord {
  name: string;
  type: "PAYMENT" | "COMMERCE" | "FULFILLMENT" | "COMMUNICATION" | "POLICY";
  provider: string;
  isSynthetic: boolean;
  createdAt: IsoDate;
}

export interface Merchant extends BaseRecord {
  name: string;
  legalName: string;
  industry: string;
  country: string;
  defaultCurrency: Currency;
  website: string;
  status: "ACTIVE" | "SUSPENDED" | "CLOSED";
  createdAt: IsoDate;
}

export interface Customer extends BaseRecord {
  merchantId: Id;
  externalId: string;
  sourceSystemId: Id;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  status: "ACTIVE" | "SUSPENDED" | "CLOSED";
  createdAt: IsoDate;
}

export interface Address extends BaseRecord {
  merchantId: Id;
  customerId: Id | null;
  recipientName: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  createdAt: IsoDate;
}

export interface Product extends BaseRecord {
  merchantId: Id;
  sku: string;
  name: string;
  description: string;
  type: "PHYSICAL" | "DIGITAL" | "SERVICE" | "SUBSCRIPTION";
  status: "ACTIVE" | "INACTIVE" | "DISCONTINUED";
  createdAt: IsoDate;
}

export interface ProductPrice extends BaseRecord {
  productId: Id;
  amountMinor: number;
  currency: Currency;
  effectiveFrom: IsoDate;
  effectiveUntil: IsoDate | null;
}

export interface PaymentMethod extends BaseRecord {
  customerId: Id;
  sourceSystemId: Id;
  externalId: string;
  type: "CARD" | "BANK_ACCOUNT" | "WALLET";
  network: "VISA" | "MASTERCARD" | "AMEX" | "DISCOVER" | null;
  lastFour: string | null;
  fingerprint: string | null;
  billingAddressId: Id | null;
  createdAt: IsoDate;
}

export interface Order extends BaseRecord {
  merchantId: Id;
  customerId: Id;
  sourceSystemId: Id;
  externalId: string;
  billingAddressId: Id;
  shippingAddressId: Id | null;
  currency: Currency;
  subtotalMinor: number;
  discountMinor: number;
  taxMinor: number;
  shippingMinor: number;
  totalMinor: number;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "COMPLETED" | "CANCELED";
  placedAt: IsoDate;
  canceledAt: IsoDate | null;
}

export interface OrderItem extends BaseRecord {
  orderId: Id;
  productId: Id;
  productPriceId: Id | null;
  productName: string;
  productDescription: string;
  quantity: number;
  unitPriceMinor: number;
  subtotalMinor: number;
  discountMinor: number;
  taxMinor: number;
  totalMinor: number;
  currency: Currency;
}

export interface OrderPolicyAcceptance extends BaseRecord {
  orderId: Id;
  policyVersionId: Id;
  acceptanceMethod: "CHECKBOX" | "CLICKWRAP" | "API";
  acceptedAt: IsoDate;
  sourceSystemId: Id;
}

export interface Payment extends BaseRecord {
  merchantId: Id;
  orderId: Id;
  customerId: Id;
  paymentMethodId: Id;
  sourceSystemId: Id;
  externalId: string;
  amountMinor: number;
  currency: Currency;
  status: "PENDING" | "AUTHORIZED" | "CAPTURED" | "FAILED" | "CANCELED" | "PARTIALLY_REFUNDED" | "REFUNDED";
  idempotencyKey: string | null;
  createdAt: IsoDate;
}

export interface Transaction extends BaseRecord {
  paymentId: Id;
  parentTransactionId: Id | null;
  sourceSystemId: Id;
  externalId: string;
  type: "AUTHORIZATION" | "CAPTURE" | "AUTHORIZATION_REVERSAL" | "SETTLEMENT" | "REFUND" | "CHARGEBACK_DEBIT" | "CHARGEBACK_REVERSAL" | "ADJUSTMENT";
  amountMinor: number;
  currency: Currency;
  status: "PENDING" | "SUCCEEDED" | "FAILED";
  failureCode: string | null;
  occurredAt: IsoDate;
}

export interface Refund extends BaseRecord {
  paymentId: Id;
  captureTransactionId: Id;
  sourceSystemId: Id;
  externalId: string;
  amountMinor: number;
  currency: Currency;
  reason: "CUSTOMER_REQUEST" | "DUPLICATE" | "PRODUCT_RETURNED" | "GOODWILL" | "OTHER";
  status: "REQUESTED" | "PROCESSING" | "SUCCEEDED" | "FAILED" | "CANCELED";
  requestedAt: IsoDate;
  completedAt: IsoDate | null;
}

export interface RefundTransaction extends BaseRecord {
  refundId: Id;
  transactionId: Id;
}

export interface PaymentAuthentication extends BaseRecord {
  paymentId: Id;
  sourceSystemId: Id;
  method: "THREE_DS" | "OTP" | "NONE" | "OTHER";
  status: "SUCCEEDED" | "FAILED" | "NOT_ATTEMPTED";
  deviceFingerprint: string | null;
  ipAddress: string | null;
  addressVerificationResult: "MATCH" | "MISMATCH" | "UNAVAILABLE";
  authenticatedAt: IsoDate | null;
}

export interface SettlementEntry extends BaseRecord {
  transactionId: Id;
  sourceSystemId: Id;
  grossAmountMinor: number;
  feeAmountMinor: number;
  netAmountMinor: number;
  currency: Currency;
  settledAt: IsoDate;
}

export interface Shipment extends BaseRecord {
  orderId: Id;
  sourceSystemId: Id;
  destinationAddressId: Id;
  trackingNumber: string;
  carrier: string;
  status: "PENDING" | "SHIPPED" | "IN_TRANSIT" | "DELIVERED" | "FAILED" | "RETURNED" | "LOST";
  createdAt: IsoDate;
  shippedAt: IsoDate | null;
  estimatedDeliveryAt: IsoDate | null;
}

export interface ShipmentItem extends BaseRecord {
  shipmentId: Id;
  orderItemId: Id;
  quantity: number;
}

export interface ShipmentEvent extends BaseRecord {
  shipmentId: Id;
  externalId: string;
  type: "PICKUP" | "IN_TRANSIT" | "DELIVERY_ATTEMPT" | "DELIVERED" | "RETURNED";
  location: string | null;
  description: string;
  occurredAt: IsoDate;
  recordedAt: IsoDate;
}

export interface DeliveryConfirmation extends BaseRecord {
  shipmentId: Id;
  shipmentEventId: Id;
  deliveredAddressId: Id | null;
  recipientName: string | null;
  confirmationMethod: "SIGNATURE" | "PHOTO" | "GPS" | "NONE";
  sourceDocumentId: Id | null;
  deliveredAt: IsoDate;
}

export interface Return extends BaseRecord {
  orderId: Id;
  customerId: Id;
  reason: string;
  status: "REQUESTED" | "APPROVED" | "REJECTED" | "IN_TRANSIT" | "RECEIVED" | "CANCELED";
  requestedAt: IsoDate;
  receivedAt: IsoDate | null;
}

export interface ReturnItem extends BaseRecord {
  returnId: Id;
  orderItemId: Id;
  quantity: number;
  condition: "NEW" | "USED" | "DAMAGED" | "UNKNOWN" | null;
}

export interface DigitalFulfillmentEvent extends BaseRecord {
  orderItemId: Id;
  customerId: Id;
  sourceSystemId: Id;
  type: "ACCESS_GRANTED" | "DOWNLOAD_COMPLETED" | "LICENSE_ACTIVATED" | "SERVICE_ACCESSED";
  resourceIdentifier: string;
  occurredAt: IsoDate;
}

export interface Conversation extends BaseRecord {
  merchantId: Id;
  customerId: Id;
  orderId: Id | null;
  sourceSystemId: Id;
  externalId: string;
  channel: "EMAIL" | "LIVE_CHAT" | "SUPPORT_TICKET";
  subject: string;
  status: "OPEN" | "CLOSED" | "PENDING";
  createdAt: IsoDate;
}

export interface Message extends BaseRecord {
  conversationId: Id;
  externalId: string;
  senderType: "CUSTOMER" | "MERCHANT" | "SYSTEM";
  senderId: Id;
  body: string;
  sentAt: IsoDate;
}

export interface MessageAttachment extends BaseRecord {
  messageId: Id;
  sourceDocumentId: Id;
}

export interface Policy extends BaseRecord {
  merchantId: Id;
  name: string;
  type: "REFUND" | "RETURN" | "SHIPPING" | "CANCELLATION" | "TERMS_OF_SERVICE";
  createdAt: IsoDate;
}

export interface PolicyVersion extends BaseRecord {
  policyId: Id;
  version: number;
  content: string;
  sourceDocumentId: Id | null;
  effectiveFrom: IsoDate;
  effectiveUntil: IsoDate | null;
  createdAt: IsoDate;
}

export interface PolicyClause extends BaseRecord {
  policyVersionId: Id;
  section: string;
  title: string;
  content: string;
}

export interface DisputeReasonCode extends BaseRecord {
  code: "PRODUCT_NOT_RECEIVED" | "PRODUCT_NOT_AS_DESCRIBED" | "DUPLICATE_CHARGE" | "REFUND_NOT_RECEIVED" | "UNAUTHORIZED_TRANSACTION" | "SUBSCRIPTION_CANCELED";
  name: string;
  description: string;
}

export interface Dispute extends BaseRecord {
  merchantId: Id;
  paymentId: Id;
  transactionId: Id;
  reasonCodeId: Id;
  requirementSetId: Id;
  sourceSystemId: Id;
  externalId: string;
  customerClaim: string;
  amountMinor: number;
  currency: Currency;
  providerStatus: "NEEDS_RESPONSE" | "UNDER_REVIEW" | "ACCEPTED" | "WON" | "LOST" | "CLOSED";
  createdAt: IsoDate;
  responseDeadline: IsoDate;
}

export interface DisputeItem extends BaseRecord {
  disputeId: Id;
  orderItemId: Id;
  quantity: number;
  amountMinor: number;
  currency: Currency;
}

export interface DisputeEvent extends BaseRecord {
  disputeId: Id;
  externalId: string;
  type: "CREATED" | "RESPONSE_DUE" | "UNDER_REVIEW" | "WON" | "LOST" | "CLOSED";
  previousStatus: Dispute["providerStatus"] | null;
  newStatus: Dispute["providerStatus"];
  occurredAt: IsoDate;
  recordedAt: IsoDate;
}

export interface DisputeRequirementSet extends BaseRecord {
  reasonCodeId: Id;
  sourceSystemId: Id;
  version: number;
  effectiveFrom: IsoDate;
  effectiveUntil: IsoDate | null;
  isSynthetic: boolean;
}

export interface DisputeRequirement extends BaseRecord {
  requirementSetId: Id;
  evidenceCategory: "PAYMENT" | "ORDER" | "DELIVERY_CONFIRMATION" | "CUSTOMER_COMMUNICATION" | "CAPTURE_TRANSACTIONS" | "REFUND_HISTORY" | "AUTHENTICATION" | "PRODUCT_DESCRIPTION" | "RETURN_RECORDS";
  description: string;
  required: boolean;
}

export interface SourceDocument extends BaseRecord {
  merchantId: Id;
  sourceSystemId: Id;
  externalId: string | null;
  name: string;
  type: "INVOICE" | "RECEIPT" | "DELIVERY_SIGNATURE" | "POLICY" | "COMMUNICATION_ATTACHMENT";
  mimeType: string;
  storagePath: string;
  checksum: string;
  createdAt: IsoDate;
}

export interface ExpectedOutcome extends BaseRecord {
  disputeId: Id;
  scenarioType: string;
  expectedRecommendation: "CONTEST" | "ACCEPT" | "COLLECT_EVIDENCE";
  expectedFinancialAmountMinor: number | null;
  currency: Currency;
  expectedSourceReferences: string[];
  expectedContradictions: string[];
  expectedMissingEvidence: string[];
  explanation: string;
}

export type SourceRecord =
  | SourceSystem
  | Merchant
  | Customer
  | Address
  | Product
  | ProductPrice
  | PaymentMethod
  | Order
  | OrderItem
  | OrderPolicyAcceptance
  | Payment
  | Transaction
  | Refund
  | RefundTransaction
  | PaymentAuthentication
  | SettlementEntry
  | Shipment
  | ShipmentItem
  | ShipmentEvent
  | DeliveryConfirmation
  | Return
  | ReturnItem
  | DigitalFulfillmentEvent
  | Conversation
  | Message
  | MessageAttachment
  | Policy
  | PolicyVersion
  | PolicyClause
  | DisputeReasonCode
  | Dispute
  | DisputeItem
  | DisputeEvent
  | DisputeRequirementSet
  | DisputeRequirement
  | SourceDocument;

export interface InvestigationRun extends BaseRecord {
  disputeId: Id;
  sourceDatasetVersion: string;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  startedAt: IsoDate;
  completedAt: IsoDate | null;
}

export interface AgentExecution extends BaseRecord {
  investigationId: Id;
  agentIdentifier: string;
  parentExecutionId: Id | null;
  taskDescription: string;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  startedAt: IsoDate;
  completedAt: IsoDate | null;
}

export interface Evidence extends BaseRecord {
  investigationId: Id;
  agentExecutionId: Id;
  category: string;
  title: string;
  description: string;
  relevance: "SUPPORTS_MERCHANT" | "SUPPORTS_CUSTOMER" | "NEUTRAL" | "CONTRADICTORY";
  verificationStatus: "UNVERIFIED" | "VERIFIED" | "CHALLENGED";
  createdAt: IsoDate;
}

export interface EvidenceSourceReference extends BaseRecord {
  evidenceId: Id;
  sourceEntity: string;
  sourceRecordId: Id;
  fieldPath: string | null;
  sourceDocumentId: Id | null;
  pageNumber: number | null;
  excerpt: string | null;
  sourceDatasetVersion: string;
}

export interface Finding extends BaseRecord {
  investigationId: Id;
  agentExecutionId: Id;
  title: string;
  statement: string;
  classification: string;
  verificationStatus: "UNVERIFIED" | "VERIFIED" | "CHALLENGED" | "REJECTED";
  createdAt: IsoDate;
}

export interface FindingEvidence extends BaseRecord {
  findingId: Id;
  evidenceId: Id;
  relationship: "SUPPORTING" | "OPPOSING";
}

export interface FindingVerification extends BaseRecord {
  findingId: Id;
  agentExecutionId: Id;
  result: "VERIFIED" | "CHALLENGED" | "REJECTED" | "INSUFFICIENT_EVIDENCE";
  explanation: string;
  createdAt: IsoDate;
}

export interface Contradiction extends BaseRecord {
  investigationId: Id;
  agentExecutionId: Id;
  description: string;
  status: "OPEN" | "RESOLVED" | "ACCEPTED";
  resolution: string | null;
  createdAt: IsoDate;
  resolvedAt: IsoDate | null;
}

export interface ContradictionEvidence extends BaseRecord {
  contradictionId: Id;
  evidenceId: Id;
}

export interface EvidenceRequest extends BaseRecord {
  investigationId: Id;
  agentExecutionId: Id;
  category: string;
  description: string;
  status: "OPEN" | "FULFILLED" | "CANCELED";
  createdAt: IsoDate;
}

export interface Resolution extends BaseRecord {
  investigationId: Id;
  agentExecutionId: Id;
  recommendation: "CONTEST" | "ACCEPT" | "COLLECT_EVIDENCE";
  summary: string;
  rationale: string;
  status: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";
  createdAt: IsoDate;
}

export interface ResolutionFinding extends BaseRecord {
  resolutionId: Id;
  findingId: Id;
}

export type InvestigationRecord =
  | InvestigationRun
  | AgentExecution
  | Evidence
  | EvidenceSourceReference
  | Finding
  | FindingEvidence
  | FindingVerification
  | Contradiction
  | ContradictionEvidence
  | EvidenceRequest
  | Resolution
  | ResolutionFinding;

export type Dataset = Record<string, SourceRecord[]>;

export interface DatasetManifest {
  datasetId: string;
  version: string;
  schemaVersion: string;
  generatorVersion: string;
  seed: number;
  generatedAt: IsoDate;
  referenceDate: IsoDate;
  recordCounts: Record<string, number>;
  checksums: Record<string, string>;
  isSynthetic: true;
}

export interface ValidationError {
  entity: string;
  recordId: string | null;
  field: string | null;
  reason: string;
}

export interface ValidationReport {
  valid: boolean;
  errors: ValidationError[];
}
