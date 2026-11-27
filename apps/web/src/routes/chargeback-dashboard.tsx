import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useChargebackDashboardQuery, useChargebackDisputesQuery } from "@/hooks/query/use-chargebacks-query";

function formatMoney(amountMinor: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amountMinor / 100);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(value));
}

export function ChargebackDashboardRoute() {
  const dashboard = useChargebackDashboardQuery();
  const disputes = useChargebackDisputesQuery();

  if (dashboard.isPending) {
    return <div className="min-h-screen bg-background p-8 text-foreground">Loading synthetic chargeback workspace…</div>;
  }

  if (dashboard.isError || !dashboard.data) {
    return <div className="min-h-screen bg-background p-8 text-rose-300">Unable to load the public chargeback API. Start the API on port 3000.</div>;
  }

  const { metrics, resourceCounts, recentDisputes } = dashboard.data;

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-cyan-400">
              <span>Chargeback OS</span>
              <Badge variant="outline" className="border-cyan-500/40 text-indigo-300">PUBLIC SYNTHETIC DATA</Badge>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Dispute operations overview</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">A live read-only view over the synthetic source and investigation records used by the Mozaik agent runtime.</p>
          </div>
          <div className="text-left text-xs text-muted-foreground sm:text-right">
            <p>API: /api/v1/chargebacks</p>
            <p>Updated {formatDate(dashboard.data.generatedAt)}</p>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5" aria-label="Chargeback metrics">
          {[
            ["Total disputes", metrics.totalDisputes.toString()],
            ["Needs response", metrics.needsResponse.toString()],
            ["Under review", metrics.underReview.toString()],
            ["At risk", formatMoney(metrics.totalAtRiskMinor)],
            ["Due in 7 days", metrics.dueSoon.toString()]
          ].map(([label, value]) => (
            <Card key={label} className="border-border bg-card text-foreground">
              <CardHeader className="pb-2"><CardDescription className="text-muted-foreground">{label}</CardDescription></CardHeader>
              <CardContent><p className="text-2xl font-semibold tracking-tight">{value}</p></CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Card className="border-border bg-card text-foreground">
            <CardHeader className="border-b border-border">
              <CardTitle>Recent disputes</CardTitle>
              <CardDescription className="text-muted-foreground">The latest records available to the investigation agents.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="px-6 py-4">Dispute</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Amount</th><th className="px-6 py-4">Deadline</th></tr></thead>
                  <tbody className="divide-y divide-slate-800">
                    {recentDisputes.map((dispute) => <tr key={dispute.id} className="hover:bg-muted/50"><td className="px-6 py-4"><p className="font-medium">{dispute.externalId}</p><p className="text-xs text-muted-foreground">{dispute.id}</p></td><td className="px-6 py-4"><Badge variant="outline" className="border-border text-foreground">{dispute.providerStatus.replaceAll("_", " ")}</Badge></td><td className="px-6 py-4">{formatMoney(dispute.amountMinor, dispute.currency)}</td><td className="px-6 py-4 text-muted-foreground">{formatDate(dispute.responseDeadline)}</td></tr>)}
                  </tbody>
                </table>
              </div>
              {disputes.isError && <p className="px-6 py-4 text-sm text-rose-300">The full dispute list endpoint is unavailable.</p>}
            </CardContent>
          </Card>

          <Card className="border-border bg-card text-foreground">
            <CardHeader className="border-b border-border"><CardTitle>Synthetic resources</CardTitle><CardDescription className="text-muted-foreground">Records exposed by the public API for inspection.</CardDescription></CardHeader>
            <CardContent className="max-h-[460px] overflow-y-auto p-0">
              <div className="divide-y divide-slate-800">{Object.entries(resourceCounts).map(([name, count]) => <div key={name} className="flex items-center justify-between px-6 py-3 text-sm"><span className="text-muted-foreground">{name}</span><span className="font-medium text-indigo-300">{count}</span></div>)}</div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
