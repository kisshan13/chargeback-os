import { ArrowRight, CircleDollarSign, FileWarning, Scale, ShieldAlert, ShoppingBag, Users, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useChargebackDashboardQuery } from "@/hooks/query/use-chargebacks-query";
import { DisputeSimulationForm } from "@/components/disputes/dispute-simulation-form";

const formatMoney = (minor: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(minor / 100);
const formatDate = (value: string) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(value));

export function DashboardOverviewRoute() {
  const query = useChargebackDashboardQuery();

  if (query.isPending) return <div className="py-10 text-sm text-muted-foreground">Loading chargeback overview…</div>;
  if (query.isError || !query.data) return <div role="alert" className="py-10 text-sm text-destructive">Could not load the dashboard. Check that the API is running.</div>;

  const { metrics, recentDisputes, resourceCounts } = query.data;
  const stats = [
    { label: "Total disputes", value: metrics.totalDisputes.toLocaleString(), detail: "Cases across your workspace", icon: Scale },
    { label: "Needs response", value: metrics.needsResponse.toLocaleString(), detail: `${metrics.dueSoon.toLocaleString()} due within 7 days`, icon: FileWarning },
    { label: "Under review", value: metrics.underReview.toLocaleString(), detail: "Active investigations", icon: ShieldAlert },
    { label: "Dispute exposure", value: formatMoney(metrics.totalAtRiskMinor), detail: "Total amount at risk", icon: CircleDollarSign }
  ];

  return (
    <div id="overview" className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div><h1 className="text-2xl font-semibold tracking-tight">Chargeback overview</h1><p className="mt-1 text-sm text-muted-foreground">A summary of dispute operations and the data behind them.</p></div>
        <span className="text-xs text-muted-foreground">Updated {new Date(query.data.generatedAt).toLocaleString()}</span>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Chargeback operations">
        {stats.map(({ label, value, detail, icon: Icon }) => <Card key={label} className="rounded-lg shadow-none"><CardHeader className="flex flex-row items-center justify-between gap-2 pb-2"><CardDescription>{label}</CardDescription><Icon className="size-4 text-indigo-400" aria-hidden="true" /></CardHeader><CardContent><p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></CardContent></Card>)}
      </section>

      <section aria-label="Start a dispute investigation"><DisputeSimulationForm compact /></section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card id="recent-disputes" className="rounded-lg shadow-none">
          <CardHeader className="flex flex-row items-start justify-between gap-4 border-b pb-4"><div><CardTitle>Recent disputes</CardTitle><CardDescription className="mt-1">Cases that may need your attention.</CardDescription></div><Link to="/disputes" className="text-sm text-indigo-400 hover:text-indigo-300">View all <ArrowRight className="ml-1 inline size-4" /></Link></CardHeader>
          <CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Dispute</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Amount</TableHead><TableHead className="text-right">Due</TableHead></TableRow></TableHeader><TableBody>{recentDisputes.slice(0, 6).map((dispute) => <TableRow key={dispute.id}><TableCell><div className="font-medium">{dispute.externalId}</div><div className="mt-1 max-w-44 truncate text-xs text-muted-foreground">{dispute.customerClaim}</div></TableCell><TableCell><StatusBadge value={dispute.providerStatus} /></TableCell><TableCell className="text-right tabular-nums">{new Intl.NumberFormat("en-US", { style: "currency", currency: dispute.currency, maximumFractionDigits: 0 }).format(dispute.amountMinor / 100)}</TableCell><TableCell className="text-right text-muted-foreground">{formatDate(dispute.responseDeadline)}</TableCell></TableRow>)}</TableBody></Table></CardContent>
        </Card>

        <Card className="rounded-lg shadow-none">
          <CardHeader className="border-b pb-4"><CardTitle>Workspace</CardTitle><CardDescription className="mt-1">Go straight to the information you need.</CardDescription></CardHeader>
          <CardContent className="divide-y p-0">
            <Link to="/customers" className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-muted/50"><Users className="size-4 text-indigo-400" /><span className="min-w-0 flex-1"><strong className="block text-sm font-medium">Customers</strong><span className="text-xs text-muted-foreground">Profiles, addresses, and purchase history</span></span><span className="text-sm tabular-nums text-muted-foreground">{(resourceCounts.customers ?? 0).toLocaleString()}</span></Link>
            <Link to="/orders" className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-muted/50"><ShoppingBag className="size-4 text-indigo-400" /><span className="min-w-0 flex-1"><strong className="block text-sm font-medium">Orders</strong><span className="text-xs text-muted-foreground">Items, customer, and fulfillment</span></span><span className="text-sm tabular-nums text-muted-foreground">{(resourceCounts.orders ?? 0).toLocaleString()}</span></Link>
            <Link to="/payments" className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-muted/50"><CreditCard className="size-4 text-indigo-400" /><span className="min-w-0 flex-1"><strong className="block text-sm font-medium">Payments</strong><span className="text-xs text-muted-foreground">Charges and refunds</span></span><span className="text-sm tabular-nums text-muted-foreground">{(resourceCounts.payments ?? 0).toLocaleString()}</span></Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
