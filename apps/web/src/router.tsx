import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RootLayout } from "./routes/__root";
import { ExampleRoute } from "./routes/example";
import { LandingPageRoute } from "./routes/landing-page";
import { DashboardLayout } from "./routes/dashboard/layout";
import { DashboardOverviewRoute } from "./routes/dashboard/index";
import { SourceSystemsPage, SourceSystemsRecordPage } from "./routes/source-systems";
import { MerchantsPage, MerchantsRecordPage } from "./routes/merchants";
import { CustomersPage, CustomersRecordPage } from "./routes/customers";
import { AddressesPage, AddressesRecordPage } from "./routes/addresses";
import { ProductsPage, ProductsRecordPage } from "./routes/products";
import { ProductPricesPage, ProductPricesRecordPage } from "./routes/product-prices";
import { PaymentMethodsPage, PaymentMethodsRecordPage } from "./routes/payment-methods";
import { OrdersPage, OrdersRecordPage } from "./routes/orders";
import { OrderItemsPage, OrderItemsRecordPage } from "./routes/order-items";
import { OrderPolicyAcceptancesPage, OrderPolicyAcceptancesRecordPage } from "./routes/order-policy-acceptances";
import { PaymentsPage, PaymentsRecordPage } from "./routes/payments";
import { TransactionsPage, TransactionsRecordPage } from "./routes/transactions";
import { PaymentAuthenticationsPage, PaymentAuthenticationsRecordPage } from "./routes/payment-authentications";
import { RefundsPage, RefundsRecordPage } from "./routes/refunds";
import { RefundTransactionsPage, RefundTransactionsRecordPage } from "./routes/refund-transactions";
import { SettlementEntriesPage, SettlementEntriesRecordPage } from "./routes/settlement-entries";
import { ShipmentsPage, ShipmentsRecordPage } from "./routes/shipments";
import { ShipmentItemsPage, ShipmentItemsRecordPage } from "./routes/shipment-items";
import { ShipmentEventsPage, ShipmentEventsRecordPage } from "./routes/shipment-events";
import { DeliveryConfirmationsPage, DeliveryConfirmationsRecordPage } from "./routes/delivery-confirmations";
import { ReturnsPage, ReturnsRecordPage } from "./routes/returns";
import { ReturnItemsPage, ReturnItemsRecordPage } from "./routes/return-items";
import { DigitalFulfillmentEventsPage, DigitalFulfillmentEventsRecordPage } from "./routes/digital-fulfillment-events";
import { ConversationsPage, ConversationsRecordPage } from "./routes/conversations";
import { MessagesPage, MessagesRecordPage } from "./routes/messages";
import { MessageAttachmentsPage, MessageAttachmentsRecordPage } from "./routes/message-attachments";
import { PoliciesPage, PoliciesRecordPage } from "./routes/policies";
import { PolicyVersionsPage, PolicyVersionsRecordPage } from "./routes/policy-versions";
import { PolicyClausesPage, PolicyClausesRecordPage } from "./routes/policy-clauses";
import { DisputeReasonCodesPage, DisputeReasonCodesRecordPage } from "./routes/dispute-reason-codes";
import { DisputesPage, DisputesRecordPage, SimulateDisputePage } from "./routes/disputes";
import { DisputeItemsPage, DisputeItemsRecordPage } from "./routes/dispute-items";
import { DisputeEventsPage, DisputeEventsRecordPage } from "./routes/dispute-events";
import { DisputeRequirementSetsPage, DisputeRequirementSetsRecordPage } from "./routes/dispute-requirement-sets";
import { DisputeRequirementsPage, DisputeRequirementsRecordPage } from "./routes/dispute-requirements";
import { SourceDocumentsPage, SourceDocumentsRecordPage } from "./routes/source-documents";
import { InvestigationRunsPage, InvestigationRunsRecordPage } from "./routes/investigation-runs";
import { AgentExecutionsPage, AgentExecutionsRecordPage } from "./routes/agent-executions";
import { EvidencePage, EvidenceRecordPage } from "./routes/evidence";
import { EvidenceSourceReferencesPage, EvidenceSourceReferencesRecordPage } from "./routes/evidence-source-references";
import { FindingsPage, FindingsRecordPage } from "./routes/findings";
import { FindingEvidencePage, FindingEvidenceRecordPage } from "./routes/finding-evidence";
import { FindingVerificationsPage, FindingVerificationsRecordPage } from "./routes/finding-verifications";
import { ContradictionsPage, ContradictionsRecordPage } from "./routes/contradictions";
import { ContradictionEvidencePage, ContradictionEvidenceRecordPage } from "./routes/contradiction-evidence";
import { EvidenceRequestsPage, EvidenceRequestsRecordPage } from "./routes/evidence-requests";
import { ResolutionsPage, ResolutionsRecordPage } from "./routes/resolutions";
import { ResolutionFindingsPage, ResolutionFindingsRecordPage } from "./routes/resolution-findings";
import { ExpectedOutcomesPage, ExpectedOutcomesRecordPage } from "./routes/expected-outcomes";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<LandingPageRoute />} />
          <Route path="/example" element={<ExampleRoute />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardOverviewRoute />} />
            <Route path="/chargebacks" element={<Navigate to="/disputes" replace />} />
            <Route path="/source-systems" element={<SourceSystemsPage />} />
            <Route path="/source-systems/:recordId" element={<SourceSystemsRecordPage />} />
            <Route path="/merchants" element={<MerchantsPage />} />
            <Route path="/merchants/:recordId" element={<MerchantsRecordPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/customers/:recordId" element={<CustomersRecordPage />} />
            <Route path="/addresses" element={<AddressesPage />} />
            <Route path="/addresses/:recordId" element={<AddressesRecordPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:recordId" element={<ProductsRecordPage />} />
            <Route path="/product-prices" element={<ProductPricesPage />} />
            <Route path="/product-prices/:recordId" element={<ProductPricesRecordPage />} />
            <Route path="/payment-methods" element={<PaymentMethodsPage />} />
            <Route path="/payment-methods/:recordId" element={<PaymentMethodsRecordPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:recordId" element={<OrdersRecordPage />} />
            <Route path="/order-items" element={<OrderItemsPage />} />
            <Route path="/order-items/:recordId" element={<OrderItemsRecordPage />} />
            <Route path="/order-policy-acceptances" element={<OrderPolicyAcceptancesPage />} />
            <Route path="/order-policy-acceptances/:recordId" element={<OrderPolicyAcceptancesRecordPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/payments/:recordId" element={<PaymentsRecordPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/transactions/:recordId" element={<TransactionsRecordPage />} />
            <Route path="/payment-authentications" element={<PaymentAuthenticationsPage />} />
            <Route path="/payment-authentications/:recordId" element={<PaymentAuthenticationsRecordPage />} />
            <Route path="/refunds" element={<RefundsPage />} />
            <Route path="/refunds/:recordId" element={<RefundsRecordPage />} />
            <Route path="/refund-transactions" element={<RefundTransactionsPage />} />
            <Route path="/refund-transactions/:recordId" element={<RefundTransactionsRecordPage />} />
            <Route path="/settlement-entries" element={<SettlementEntriesPage />} />
            <Route path="/settlement-entries/:recordId" element={<SettlementEntriesRecordPage />} />
            <Route path="/shipments" element={<ShipmentsPage />} />
            <Route path="/shipments/:recordId" element={<ShipmentsRecordPage />} />
            <Route path="/shipment-items" element={<ShipmentItemsPage />} />
            <Route path="/shipment-items/:recordId" element={<ShipmentItemsRecordPage />} />
            <Route path="/shipment-events" element={<ShipmentEventsPage />} />
            <Route path="/shipment-events/:recordId" element={<ShipmentEventsRecordPage />} />
            <Route path="/delivery-confirmations" element={<DeliveryConfirmationsPage />} />
            <Route path="/delivery-confirmations/:recordId" element={<DeliveryConfirmationsRecordPage />} />
            <Route path="/returns" element={<ReturnsPage />} />
            <Route path="/returns/:recordId" element={<ReturnsRecordPage />} />
            <Route path="/return-items" element={<ReturnItemsPage />} />
            <Route path="/return-items/:recordId" element={<ReturnItemsRecordPage />} />
            <Route path="/digital-fulfillment-events" element={<DigitalFulfillmentEventsPage />} />
            <Route path="/digital-fulfillment-events/:recordId" element={<DigitalFulfillmentEventsRecordPage />} />
            <Route path="/conversations" element={<ConversationsPage />} />
            <Route path="/conversations/:recordId" element={<ConversationsRecordPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/messages/:recordId" element={<MessagesRecordPage />} />
            <Route path="/message-attachments" element={<MessageAttachmentsPage />} />
            <Route path="/message-attachments/:recordId" element={<MessageAttachmentsRecordPage />} />
            <Route path="/policies" element={<PoliciesPage />} />
            <Route path="/policies/:recordId" element={<PoliciesRecordPage />} />
            <Route path="/policy-versions" element={<PolicyVersionsPage />} />
            <Route path="/policy-versions/:recordId" element={<PolicyVersionsRecordPage />} />
            <Route path="/policy-clauses" element={<PolicyClausesPage />} />
            <Route path="/policy-clauses/:recordId" element={<PolicyClausesRecordPage />} />
            <Route path="/dispute-reason-codes" element={<DisputeReasonCodesPage />} />
            <Route path="/dispute-reason-codes/:recordId" element={<DisputeReasonCodesRecordPage />} />
            <Route path="/disputes" element={<DisputesPage />} />
            <Route path="/disputes/simulate" element={<SimulateDisputePage />} />
            <Route path="/disputes/:recordId" element={<DisputesRecordPage />} />
            <Route path="/dispute-items" element={<DisputeItemsPage />} />
            <Route path="/dispute-items/:recordId" element={<DisputeItemsRecordPage />} />
            <Route path="/dispute-events" element={<DisputeEventsPage />} />
            <Route path="/dispute-events/:recordId" element={<DisputeEventsRecordPage />} />
            <Route path="/dispute-requirement-sets" element={<DisputeRequirementSetsPage />} />
            <Route path="/dispute-requirement-sets/:recordId" element={<DisputeRequirementSetsRecordPage />} />
            <Route path="/dispute-requirements" element={<DisputeRequirementsPage />} />
            <Route path="/dispute-requirements/:recordId" element={<DisputeRequirementsRecordPage />} />
            <Route path="/source-documents" element={<SourceDocumentsPage />} />
            <Route path="/source-documents/:recordId" element={<SourceDocumentsRecordPage />} />
            <Route path="/investigation-runs" element={<InvestigationRunsPage />} />
            <Route path="/investigation-runs/:recordId" element={<InvestigationRunsRecordPage />} />
            <Route path="/agent-executions" element={<AgentExecutionsPage />} />
            <Route path="/agent-executions/:recordId" element={<AgentExecutionsRecordPage />} />
            <Route path="/evidence" element={<EvidencePage />} />
            <Route path="/evidence/:recordId" element={<EvidenceRecordPage />} />
            <Route path="/evidence-source-references" element={<EvidenceSourceReferencesPage />} />
            <Route path="/evidence-source-references/:recordId" element={<EvidenceSourceReferencesRecordPage />} />
            <Route path="/findings" element={<FindingsPage />} />
            <Route path="/findings/:recordId" element={<FindingsRecordPage />} />
            <Route path="/finding-evidence" element={<FindingEvidencePage />} />
            <Route path="/finding-evidence/:recordId" element={<FindingEvidenceRecordPage />} />
            <Route path="/finding-verifications" element={<FindingVerificationsPage />} />
            <Route path="/finding-verifications/:recordId" element={<FindingVerificationsRecordPage />} />
            <Route path="/contradictions" element={<ContradictionsPage />} />
            <Route path="/contradictions/:recordId" element={<ContradictionsRecordPage />} />
            <Route path="/contradiction-evidence" element={<ContradictionEvidencePage />} />
            <Route path="/contradiction-evidence/:recordId" element={<ContradictionEvidenceRecordPage />} />
            <Route path="/evidence-requests" element={<EvidenceRequestsPage />} />
            <Route path="/evidence-requests/:recordId" element={<EvidenceRequestsRecordPage />} />
            <Route path="/resolutions" element={<ResolutionsPage />} />
            <Route path="/resolutions/:recordId" element={<ResolutionsRecordPage />} />
            <Route path="/resolution-findings" element={<ResolutionFindingsPage />} />
            <Route path="/resolution-findings/:recordId" element={<ResolutionFindingsRecordPage />} />
            <Route path="/expected-outcomes" element={<ExpectedOutcomesPage />} />
            <Route path="/expected-outcomes/:recordId" element={<ExpectedOutcomesRecordPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
