import { ArrowRight, CheckCircle2, CircleDollarSign, Clock3, CreditCard, PackageCheck, Scale, UsersRound, Webhook } from "lucide-react";
import { Link } from "react-router-dom";
import { CustomWordmark } from "@/components/custom-ui";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useChargebackDashboardQuery } from "@/hooks/query/use-chargebacks-query";

const formatMoney = (amountMinor: number) => new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
}).format(amountMinor / 100);

const formatDate = (value: string) => new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric"
}).format(new Date(value));

export function LandingPageRoute() {
  const dashboard = useChargebackDashboardQuery();
  const recentDisputes = dashboard.data?.recentDisputes.slice(0, 3) ?? [];

  return (
    <div className="chargeback-page">
      <header className="chargeback-container chargeback-header">
        <CustomWordmark href="/" aria-label="Chargeback OS home">
          chargeback os
        </CustomWordmark>
        <nav className="chargeback-nav" aria-label="Main navigation">
          <a href="#workflow">How it works</a>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
      </header>

      <main>
        <section className="chargeback-container chargeback-hero" aria-labelledby="hero-title">
          <div className="chargeback-hero-content">
            <h1 id="hero-title">Turn dispute events into evidence ready responses.</h1>
            <p>
              From webhook alert to customer, order, and subscription evidence—give your team a
              clear case and a confident next step.
            </p>
            <Button
              size="lg"
              className="chargeback-primary-button"
              render={<Link to="/dashboard" />}
            >
              Explore the dashboard <ArrowRight aria-hidden="true" />
            </Button>
          </div>

          <Card className="chargeback-preview" aria-label="Chargeback dashboard preview">
            <CardHeader className="chargeback-preview-header">
              <div>
                <CardTitle>Dispute operations</CardTitle>
                <CardDescription className="chargeback-preview-meta">
                  {dashboard.data?.isSynthetic ? "Current workspace overview" : "Workspace overview"}
                </CardDescription>
              </div>
              <Link to="/dashboard" className="chargeback-preview-link">View dashboard</Link>
            </CardHeader>
            {dashboard.data ? (
              <CardContent className="chargeback-preview-body">
                <div className="chargeback-metrics" aria-label="Dispute metrics">
                  <div><span><Scale size={15} aria-hidden="true" /> Total disputes</span><strong>{dashboard.data.metrics.totalDisputes.toLocaleString()}</strong></div>
                  <div><span><Clock3 size={15} aria-hidden="true" /> Needs response</span><strong>{dashboard.data.metrics.needsResponse.toLocaleString()}</strong></div>
                  <div><span><CircleDollarSign size={15} aria-hidden="true" /> At risk</span><strong>{formatMoney(dashboard.data.metrics.totalAtRiskMinor)}</strong></div>
                </div>
                <div className="chargeback-preview-list">
                  <div className="chargeback-preview-list-heading">
                    <strong>Recent disputes</strong>
                    <span>Response deadline</span>
                  </div>
                  {recentDisputes.map((dispute) => (
                    <div className="chargeback-preview-row" key={dispute.id}>
                      <span><strong>{dispute.externalId}</strong><small>{dispute.providerStatus.toLowerCase().replaceAll("_", " ")}</small></span>
                      <span>{formatDate(dispute.responseDeadline)}</span>
                    </div>
                  ))}
                  {recentDisputes.length === 0 && (
                    <p className="chargeback-preview-empty" role="status">
                      {dashboard.isError ? "Dashboard data is unavailable right now." : "Loading recent disputes…"}
                    </p>
                  )}
                </div>
              </CardContent>
            ) : (
              <CardContent className="chargeback-preview-loading" role="status">
                {dashboard.isError ? "Dashboard metrics are unavailable right now." : "Loading live dashboard metrics…"}
              </CardContent>
            )}
          </Card>
        </section>

        <section className="chargeback-container chargeback-workflow" id="workflow" aria-labelledby="workflow-title">
          <h2 id="workflow-title">Build the case from the business context you already have.</h2>
          <p className="chargeback-section-intro">
            A strong response depends on the full story behind a payment. Bring relevant records
            together, give each investigation a clear trail, and make missing evidence visible.
          </p>
          <div className="chargeback-workflow-grid chargeback-source-grid">
            <Card className="chargeback-feature-card">
              <CardHeader>
                <UsersRound className="chargeback-feature-icon" aria-hidden="true" />
                <CardTitle>Customer history</CardTitle>
                <CardDescription>Review customer details, support conversations, and relevant policy acknowledgements.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="chargeback-feature-card">
              <CardHeader>
                <PackageCheck className="chargeback-feature-icon" aria-hidden="true" />
                <CardTitle>Orders and fulfillment</CardTitle>
                <CardDescription>Connect order items, shipment updates, delivery confirmation, returns, and digital fulfillment.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="chargeback-feature-card">
              <CardHeader>
                <CreditCard className="chargeback-feature-icon" aria-hidden="true" />
                <CardTitle>Payments and subscriptions</CardTitle>
                <CardDescription>Understand payment activity, refunds, and recurring billing or cancellation history.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="chargeback-feature-card">
              <CardHeader>
                <Webhook className="chargeback-feature-icon" aria-hidden="true" />
                <CardTitle>Webhook to investigation</CardTitle>
                <CardDescription>Normalize provider dispute events, prevent duplicate handling, and follow investigation progress as it unfolds.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section className="chargeback-container chargeback-response" aria-labelledby="response-title">
          <div>
            <h2 id="response-title">Make a defensible decision, then move quickly.</h2>
            <p>
              Specialist agents gather source-backed evidence, flag gaps or conflicting facts, and
              draft a response recommendation. Your team reviews the case and approves the next
              action, with a clear record of what informed the decision.
            </p>
          </div>
          <Card className="chargeback-response-card">
            <CardHeader>
              <CardTitle>From dispute to decision</CardTitle>
              <CardDescription>One traceable investigation, with people in control of the response.</CardDescription>
            </CardHeader>
            <CardContent className="chargeback-response-list">
              <p><CheckCircle2 aria-hidden="true" /> Evidence linked to its source records</p>
              <p><CheckCircle2 aria-hidden="true" /> Missing information and contradictions surfaced</p>
              <p><CheckCircle2 aria-hidden="true" /> Resolution prepared for human review</p>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="chargeback-container chargeback-footer">
        <p>Chargeback OS — a shared workspace for dispute investigation and review.</p>
      </footer>
    </div>
  );
}
