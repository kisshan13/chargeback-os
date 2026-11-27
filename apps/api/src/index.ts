import "./config/env.js";
import "./lib/chargeback-runtime.js";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { env, corsOrigins } from "./config/env.js";
import { createOpenApiDocument } from "./openapi/document.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import loggerMiddleware from "./middlewares/logger.middleware.js";
import logger from "./lib/pino.js";
import {
  chargebackEventsRoutes,
  chargebacksRoutes,
  exampleRoutes,
  sourceSystemsRoutes,
  merchantsRoutes,
  customersRoutes,
  addressesRoutes,
  productsRoutes,
  productPricesRoutes,
  paymentMethodsRoutes,
  ordersRoutes,
  orderItemsRoutes,
  orderPolicyAcceptancesRoutes,
  paymentsRoutes,
  transactionsRoutes,
  paymentAuthenticationsRoutes,
  refundsRoutes,
  refundTransactionsRoutes,
  settlementEntriesRoutes,
  shipmentsRoutes,
  shipmentItemsRoutes,
  shipmentEventsRoutes,
  deliveryConfirmationsRoutes,
  returnsRoutes,
  returnItemsRoutes,
  digitalFulfillmentEventsRoutes,
  conversationsRoutes,
  messagesRoutes,
  messageAttachmentsRoutes,
  policiesRoutes,
  policyVersionsRoutes,
  policyClausesRoutes,
  disputeReasonCodesRoutes,
  disputesRoutes,
  disputeItemsRoutes,
  disputeEventsRoutes,
  disputeRequirementSetsRoutes,
  disputeRequirementsRoutes,
  sourceDocumentsRoutes,
  investigationRunsRoutes,
  agentExecutionsRoutes,
  evidenceRoutes,
  evidenceSourceReferencesRoutes,
  findingsRoutes,
  findingEvidenceRoutes,
  findingVerificationsRoutes,
  contradictionsRoutes,
  contradictionEvidenceRoutes,
  evidenceRequestsRoutes,
  resolutionsRoutes,
  resolutionFindingsRoutes,
  expectedOutcomesRoutes
} from "./routes/index.js";

const app: Express = express();
const publicDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "../public");

app.set("trust proxy", 1);
app.use(loggerMiddleware);
app.use(helmet());
app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/openapi.json", (_req, res) => {
  res.json(createOpenApiDocument());
});

app.use("/api/v1/example", exampleRoutes);
app.use("/api/v1/chargebacks/events", chargebackEventsRoutes);
app.use("/api/v1/chargebacks", chargebacksRoutes);
app.use("/api/v1/source-systems", sourceSystemsRoutes);
app.use("/api/v1/merchants", merchantsRoutes);
app.use("/api/v1/customers", customersRoutes);
app.use("/api/v1/addresses", addressesRoutes);
app.use("/api/v1/products", productsRoutes);
app.use("/api/v1/product-prices", productPricesRoutes);
app.use("/api/v1/payment-methods", paymentMethodsRoutes);
app.use("/api/v1/orders", ordersRoutes);
app.use("/api/v1/order-items", orderItemsRoutes);
app.use("/api/v1/order-policy-acceptances", orderPolicyAcceptancesRoutes);
app.use("/api/v1/payments", paymentsRoutes);
app.use("/api/v1/transactions", transactionsRoutes);
app.use("/api/v1/payment-authentications", paymentAuthenticationsRoutes);
app.use("/api/v1/refunds", refundsRoutes);
app.use("/api/v1/refund-transactions", refundTransactionsRoutes);
app.use("/api/v1/settlement-entries", settlementEntriesRoutes);
app.use("/api/v1/shipments", shipmentsRoutes);
app.use("/api/v1/shipment-items", shipmentItemsRoutes);
app.use("/api/v1/shipment-events", shipmentEventsRoutes);
app.use("/api/v1/delivery-confirmations", deliveryConfirmationsRoutes);
app.use("/api/v1/returns", returnsRoutes);
app.use("/api/v1/return-items", returnItemsRoutes);
app.use("/api/v1/digital-fulfillment-events", digitalFulfillmentEventsRoutes);
app.use("/api/v1/conversations", conversationsRoutes);
app.use("/api/v1/messages", messagesRoutes);
app.use("/api/v1/message-attachments", messageAttachmentsRoutes);
app.use("/api/v1/policies", policiesRoutes);
app.use("/api/v1/policy-versions", policyVersionsRoutes);
app.use("/api/v1/policy-clauses", policyClausesRoutes);
app.use("/api/v1/dispute-reason-codes", disputeReasonCodesRoutes);
app.use("/api/v1/disputes", disputesRoutes);
app.use("/api/v1/dispute-items", disputeItemsRoutes);
app.use("/api/v1/dispute-events", disputeEventsRoutes);
app.use("/api/v1/dispute-requirement-sets", disputeRequirementSetsRoutes);
app.use("/api/v1/dispute-requirements", disputeRequirementsRoutes);
app.use("/api/v1/source-documents", sourceDocumentsRoutes);
app.use("/api/v1/investigation-runs", investigationRunsRoutes);
app.use("/api/v1/agent-executions", agentExecutionsRoutes);
app.use("/api/v1/evidence", evidenceRoutes);
app.use("/api/v1/evidence-source-references", evidenceSourceReferencesRoutes);
app.use("/api/v1/findings", findingsRoutes);
app.use("/api/v1/finding-evidence", findingEvidenceRoutes);
app.use("/api/v1/finding-verifications", findingVerificationsRoutes);
app.use("/api/v1/contradictions", contradictionsRoutes);
app.use("/api/v1/contradiction-evidence", contradictionEvidenceRoutes);
app.use("/api/v1/evidence-requests", evidenceRequestsRoutes);
app.use("/api/v1/resolutions", resolutionsRoutes);
app.use("/api/v1/resolution-findings", resolutionFindingsRoutes);
app.use("/api/v1/expected-outcomes", expectedOutcomesRoutes);

// The web build is written to apps/api/public and served from the same origin.
// Keep API paths out of the SPA fallback so unknown API requests remain 404s.
app.use(express.static(publicDirectory, { index: false }));
app.use((req, res, next) => {
  if (req.path === "/api" || req.path.startsWith("/api/")) return next();
  if (req.method !== "GET" || !req.accepts("html")) return next();
  res.sendFile(resolve(publicDirectory, "index.html"), (error) => {
    if (error) next(error);
  });
});
app.use(errorMiddleware);

if (env.NODE_ENV !== "test") {
  app.listen(env.PORT, () => {
    logger.info(`API listening on http://localhost:${env.PORT}`);
  });
}

export default app;
