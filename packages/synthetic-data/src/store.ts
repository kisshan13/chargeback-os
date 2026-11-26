import { join } from "node:path";
import * as C from "./collections/index.js";
import type * as S from "./schema.js";

type Input<T extends S.BaseRecord> = C.CollectionInput<T>;

export interface SourceCollectionInputs {
  sourceSystems?: Input<S.SourceSystem>;
  merchants?: Input<S.Merchant>;
  customers?: Input<S.Customer>;
  addresses?: Input<S.Address>;
  products?: Input<S.Product>;
  productPrices?: Input<S.ProductPrice>;
  paymentMethods?: Input<S.PaymentMethod>;
  orders?: Input<S.Order>;
  orderItems?: Input<S.OrderItem>;
  orderPolicyAcceptances?: Input<S.OrderPolicyAcceptance>;
  payments?: Input<S.Payment>;
  transactions?: Input<S.Transaction>;
  paymentAuthentications?: Input<S.PaymentAuthentication>;
  refunds?: Input<S.Refund>;
  refundTransactions?: Input<S.RefundTransaction>;
  settlementEntries?: Input<S.SettlementEntry>;
  shipments?: Input<S.Shipment>;
  shipmentItems?: Input<S.ShipmentItem>;
  shipmentEvents?: Input<S.ShipmentEvent>;
  deliveryConfirmations?: Input<S.DeliveryConfirmation>;
  returns?: Input<S.Return>;
  returnItems?: Input<S.ReturnItem>;
  digitalFulfillmentEvents?: Input<S.DigitalFulfillmentEvent>;
  conversations?: Input<S.Conversation>;
  messages?: Input<S.Message>;
  messageAttachments?: Input<S.MessageAttachment>;
  policies?: Input<S.Policy>;
  policyVersions?: Input<S.PolicyVersion>;
  policyClauses?: Input<S.PolicyClause>;
  disputeReasonCodes?: Input<S.DisputeReasonCode>;
  disputes?: Input<S.Dispute>;
  disputeItems?: Input<S.DisputeItem>;
  disputeEvents?: Input<S.DisputeEvent>;
  disputeRequirementSets?: Input<S.DisputeRequirementSet>;
  disputeRequirements?: Input<S.DisputeRequirement>;
  sourceDocuments?: Input<S.SourceDocument>;
}

export interface InvestigationCollectionInputs {
  investigationRuns?: Input<S.InvestigationRun>;
  agentExecutions?: Input<S.AgentExecution>;
  evidence?: Input<S.Evidence>;
  evidenceSourceReferences?: Input<S.EvidenceSourceReference>;
  findings?: Input<S.Finding>;
  findingEvidence?: Input<S.FindingEvidence>;
  findingVerifications?: Input<S.FindingVerification>;
  contradictions?: Input<S.Contradiction>;
  contradictionEvidence?: Input<S.ContradictionEvidence>;
  evidenceRequests?: Input<S.EvidenceRequest>;
  resolutions?: Input<S.Resolution>;
  resolutionFindings?: Input<S.ResolutionFinding>;
}

export interface SyntheticDataStoreInput extends SourceCollectionInputs, InvestigationCollectionInputs {
  expectedOutcomes?: Input<S.ExpectedOutcome>;
}

/**
 * Typed facade over all synthetic entities. It is an in-memory contract, not
 * a database: each property is an independent read-only collection and can be
 * initialized with either records or a JSONL file path.
 */
export class SyntheticDataStore {
  public readonly sourceSystems: C.SourceSystemsCollection;
  public readonly merchants: C.MerchantsCollection;
  public readonly customers: C.CustomersCollection;
  public readonly addresses: C.AddressesCollection;
  public readonly products: C.ProductsCollection;
  public readonly productPrices: C.ProductPricesCollection;
  public readonly paymentMethods: C.PaymentMethodsCollection;
  public readonly orders: C.OrdersCollection;
  public readonly orderItems: C.OrderItemsCollection;
  public readonly orderPolicyAcceptances: C.OrderPolicyAcceptancesCollection;
  public readonly payments: C.PaymentsCollection;
  public readonly transactions: C.TransactionsCollection;
  public readonly paymentAuthentications: C.PaymentAuthenticationsCollection;
  public readonly refunds: C.RefundsCollection;
  public readonly refundTransactions: C.RefundTransactionsCollection;
  public readonly settlementEntries: C.SettlementEntriesCollection;
  public readonly shipments: C.ShipmentsCollection;
  public readonly shipmentItems: C.ShipmentItemsCollection;
  public readonly shipmentEvents: C.ShipmentEventsCollection;
  public readonly deliveryConfirmations: C.DeliveryConfirmationsCollection;
  public readonly returns: C.ReturnsCollection;
  public readonly returnItems: C.ReturnItemsCollection;
  public readonly digitalFulfillmentEvents: C.DigitalFulfillmentEventsCollection;
  public readonly conversations: C.ConversationsCollection;
  public readonly messages: C.MessagesCollection;
  public readonly messageAttachments: C.MessageAttachmentsCollection;
  public readonly policies: C.PoliciesCollection;
  public readonly policyVersions: C.PolicyVersionsCollection;
  public readonly policyClauses: C.PolicyClausesCollection;
  public readonly disputeReasonCodes: C.DisputeReasonCodesCollection;
  public readonly disputes: C.DisputesCollection;
  public readonly disputeItems: C.DisputeItemsCollection;
  public readonly disputeEvents: C.DisputeEventsCollection;
  public readonly disputeRequirementSets: C.DisputeRequirementSetsCollection;
  public readonly disputeRequirements: C.DisputeRequirementsCollection;
  public readonly sourceDocuments: C.SourceDocumentsCollection;

  public readonly investigationRuns: C.InvestigationRunsCollection;
  public readonly agentExecutions: C.AgentExecutionsCollection;
  public readonly evidence: C.EvidenceCollection;
  public readonly evidenceSourceReferences: C.EvidenceSourceReferencesCollection;
  public readonly findings: C.FindingsCollection;
  public readonly findingEvidence: C.FindingEvidenceCollection;
  public readonly findingVerifications: C.FindingVerificationsCollection;
  public readonly contradictions: C.ContradictionsCollection;
  public readonly contradictionEvidence: C.ContradictionEvidenceCollection;
  public readonly evidenceRequests: C.EvidenceRequestsCollection;
  public readonly resolutions: C.ResolutionsCollection;
  public readonly resolutionFindings: C.ResolutionFindingsCollection;
  public readonly expectedOutcomes: C.ExpectedOutcomesCollection;

  constructor(input: SyntheticDataStoreInput = {}) {
    this.sourceSystems = new C.SourceSystemsCollection(input.sourceSystems);
    this.merchants = new C.MerchantsCollection(input.merchants);
    this.customers = new C.CustomersCollection(input.customers);
    this.addresses = new C.AddressesCollection(input.addresses);
    this.products = new C.ProductsCollection(input.products);
    this.productPrices = new C.ProductPricesCollection(input.productPrices);
    this.paymentMethods = new C.PaymentMethodsCollection(input.paymentMethods);
    this.orders = new C.OrdersCollection(input.orders);
    this.orderItems = new C.OrderItemsCollection(input.orderItems);
    this.orderPolicyAcceptances = new C.OrderPolicyAcceptancesCollection(input.orderPolicyAcceptances);
    this.payments = new C.PaymentsCollection(input.payments);
    this.transactions = new C.TransactionsCollection(input.transactions);
    this.paymentAuthentications = new C.PaymentAuthenticationsCollection(input.paymentAuthentications);
    this.refunds = new C.RefundsCollection(input.refunds);
    this.refundTransactions = new C.RefundTransactionsCollection(input.refundTransactions);
    this.settlementEntries = new C.SettlementEntriesCollection(input.settlementEntries);
    this.shipments = new C.ShipmentsCollection(input.shipments);
    this.shipmentItems = new C.ShipmentItemsCollection(input.shipmentItems);
    this.shipmentEvents = new C.ShipmentEventsCollection(input.shipmentEvents);
    this.deliveryConfirmations = new C.DeliveryConfirmationsCollection(input.deliveryConfirmations);
    this.returns = new C.ReturnsCollection(input.returns);
    this.returnItems = new C.ReturnItemsCollection(input.returnItems);
    this.digitalFulfillmentEvents = new C.DigitalFulfillmentEventsCollection(input.digitalFulfillmentEvents);
    this.conversations = new C.ConversationsCollection(input.conversations);
    this.messages = new C.MessagesCollection(input.messages);
    this.messageAttachments = new C.MessageAttachmentsCollection(input.messageAttachments);
    this.policies = new C.PoliciesCollection(input.policies);
    this.policyVersions = new C.PolicyVersionsCollection(input.policyVersions);
    this.policyClauses = new C.PolicyClausesCollection(input.policyClauses);
    this.disputeReasonCodes = new C.DisputeReasonCodesCollection(input.disputeReasonCodes);
    this.disputes = new C.DisputesCollection(input.disputes);
    this.disputeItems = new C.DisputeItemsCollection(input.disputeItems);
    this.disputeEvents = new C.DisputeEventsCollection(input.disputeEvents);
    this.disputeRequirementSets = new C.DisputeRequirementSetsCollection(input.disputeRequirementSets);
    this.disputeRequirements = new C.DisputeRequirementsCollection(input.disputeRequirements);
    this.sourceDocuments = new C.SourceDocumentsCollection(input.sourceDocuments);

    this.investigationRuns = new C.InvestigationRunsCollection(input.investigationRuns);
    this.agentExecutions = new C.AgentExecutionsCollection(input.agentExecutions);
    this.evidence = new C.EvidenceCollection(input.evidence);
    this.evidenceSourceReferences = new C.EvidenceSourceReferencesCollection(input.evidenceSourceReferences);
    this.findings = new C.FindingsCollection(input.findings);
    this.findingEvidence = new C.FindingEvidenceCollection(input.findingEvidence);
    this.findingVerifications = new C.FindingVerificationsCollection(input.findingVerifications);
    this.contradictions = new C.ContradictionsCollection(input.contradictions);
    this.contradictionEvidence = new C.ContradictionEvidenceCollection(input.contradictionEvidence);
    this.evidenceRequests = new C.EvidenceRequestsCollection(input.evidenceRequests);
    this.resolutions = new C.ResolutionsCollection(input.resolutions);
    this.resolutionFindings = new C.ResolutionFindingsCollection(input.resolutionFindings);
    this.expectedOutcomes = new C.ExpectedOutcomesCollection(input.expectedOutcomes);
  }

  static fromDataDirectory(dataDirectory: string): SyntheticDataStore {
    const source = (entity: string) => join(dataDirectory, "source", `${entity}.jsonl`);
    const investigation = (entity: string) => join(dataDirectory, "investigation", `${entity}.jsonl`);
    return new SyntheticDataStore({
      sourceSystems: source("source_systems"), merchants: source("merchants"), customers: source("customers"), addresses: source("addresses"), products: source("products"), productPrices: source("product_prices"), paymentMethods: source("payment_methods"), orders: source("orders"), orderItems: source("order_items"), orderPolicyAcceptances: source("order_policy_acceptances"), payments: source("payments"), transactions: source("transactions"), paymentAuthentications: source("payment_authentications"), refunds: source("refunds"), refundTransactions: source("refund_transactions"), settlementEntries: source("settlement_entries"), shipments: source("shipments"), shipmentItems: source("shipment_items"), shipmentEvents: source("shipment_events"), deliveryConfirmations: source("delivery_confirmations"), returns: source("returns"), returnItems: source("return_items"), digitalFulfillmentEvents: source("digital_fulfillment_events"), conversations: source("conversations"), messages: source("messages"), messageAttachments: source("message_attachments"), policies: source("policies"), policyVersions: source("policy_versions"), policyClauses: source("policy_clauses"), disputeReasonCodes: source("dispute_reason_codes"), disputes: source("disputes"), disputeItems: source("dispute_items"), disputeEvents: source("dispute_events"), disputeRequirementSets: source("dispute_requirement_sets"), disputeRequirements: source("dispute_requirements"), sourceDocuments: source("source_documents"),
      investigationRuns: investigation("investigation_runs"), agentExecutions: investigation("agent_executions"), evidence: investigation("evidence"), evidenceSourceReferences: investigation("evidence_source_references"), findings: investigation("findings"), findingEvidence: investigation("finding_evidence"), findingVerifications: investigation("finding_verifications"), contradictions: investigation("contradictions"), contradictionEvidence: investigation("contradiction_evidence"), evidenceRequests: investigation("evidence_requests"), resolutions: investigation("resolutions"), resolutionFindings: investigation("resolution_findings")
    });
  }
}
