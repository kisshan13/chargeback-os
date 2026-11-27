import { Link, useParams } from "react-router-dom";
import { ArrowRight, FileText, Info, Scale } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SyntheticRecord } from "@/core-api/types";
import { useDisputeReasonCodesQuery } from "@/hooks/query/use-dispute-reason-codes-query";
import { usePoliciesQuery, usePolicyOverviewQuery } from "@/hooks/query/use-policies-query";

function value(record: Record<string, unknown>, key: string, fallback = "—") {
  const result = record[key];
  return result === null || result === undefined || result === "" ? fallback : String(result);
}
function date(value: unknown) {
  if (typeof value !== "string") return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.valueOf()) ? "—" : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(parsed);
}

export function PoliciesPage() {
  const policiesQuery = usePoliciesQuery(50, 0);
  const reasonsQuery = useDisputeReasonCodesQuery(50, 0);
  const policies = policiesQuery.data?.items ?? [];
  const reasons = reasonsQuery.data?.items ?? [];
  return <div className="space-y-6"><div><h1 className="text-2xl font-semibold tracking-tight">Policies & dispute reasons</h1><p className="mt-1 text-sm text-muted-foreground">Review customer-facing policy versions and the reasons customers dispute a payment.</p></div>
    <Card className="rounded-lg border-indigo-900/70 bg-indigo-950/20 shadow-none dark:border-indigo-900 dark:bg-indigo-950/20"><CardContent className="flex items-start gap-3 p-4"><Info className="mt-0.5 size-4 shrink-0 text-indigo-400" /><div><p className="text-sm font-medium">Privacy Policy</p><p className="mt-1 text-sm text-muted-foreground">The current synthetic dataset does not include a privacy policy document. No policy text is shown here because none is available in the source data.</p></div></CardContent></Card>
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"><Card className="rounded-lg shadow-none"><CardHeader className="border-b pb-4"><CardTitle>Customer policies</CardTitle><CardDescription>Terms and policy versions captured in the dataset.</CardDescription></CardHeader>{policiesQuery.isPending && <CardContent className="py-8 text-sm text-muted-foreground">Loading policies…</CardContent>}{policiesQuery.isError && <CardContent role="alert" className="py-8 text-sm text-destructive">Could not load policies.</CardContent>}<CardContent className="divide-y p-0">{policies.map((policy) => <Link key={policy.id} to={`/policies/${encodeURIComponent(policy.id)}`} className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-muted/50"><span className="flex min-w-0 items-center gap-3"><FileText className="size-4 shrink-0 text-indigo-400" /><span className="min-w-0"><span className="block truncate text-sm font-medium">{String(policy.name)}</span><span className="mt-0.5 block text-xs text-muted-foreground">{String(policy.versionCount ?? 0)} versions · Current v{String(policy.currentVersion ?? "—")}</span></span></span><ArrowRight className="size-4 shrink-0 text-muted-foreground" /></Link>)}</CardContent></Card>
      <Card className="rounded-lg shadow-none"><CardHeader className="border-b pb-4"><CardTitle className="flex items-center gap-2"><Scale className="size-4 text-indigo-400" />Dispute reasons</CardTitle><CardDescription>Reason categories and the cardholder claim they represent.</CardDescription></CardHeader>{reasonsQuery.isPending && <CardContent className="py-8 text-sm text-muted-foreground">Loading dispute reasons…</CardContent>}{reasonsQuery.isError && <CardContent role="alert" className="py-8 text-sm text-destructive">Could not load dispute reasons.</CardContent>}<CardContent className="divide-y p-0">{reasons.map((reason) => <div key={reason.id} className="px-5 py-4"><p className="text-sm font-medium">{String(reason.name)}</p><p className="mt-1 text-sm text-muted-foreground">{String(reason.description)}</p></div>)}</CardContent></Card></div>
  </div>;
}

export function PoliciesRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = usePolicyOverviewQuery(recordId);
  if (query.isPending) return <p className="py-10 text-sm text-muted-foreground">Loading policy…</p>;
  if (query.isError || !query.data) return <p role="alert" className="py-10 text-sm text-destructive">Could not load this policy.</p>;
  const { policy, merchant, versions } = query.data;
  return <div className="space-y-6"><div><p className="mb-2 text-sm text-muted-foreground"><Link to="/policies" className="hover:text-indigo-300">Policies & reasons</Link><span className="mx-2">/</span>Policy details</p><div className="flex flex-wrap items-start justify-between gap-3"><div><h1 className="text-2xl font-semibold tracking-tight">{value(policy, "name")}</h1><p className="mt-1 text-sm text-muted-foreground">{value(merchant ?? {}, "name", "Merchant policy")} · {value(policy, "type").toLowerCase().replaceAll("_", " ")}</p></div><StatusBadge value={versions.some((version) => version.effectiveUntil === null) ? "ACTIVE" : "CLOSED"} /></div></div>
    <div className="space-y-4">{versions.map((version) => <Card key={version.id} className="rounded-lg shadow-none"><CardHeader className="border-b pb-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><CardTitle>Version {value(version, "version")}</CardTitle><CardDescription className="mt-1">Effective {date(version.effectiveFrom)}{version.effectiveUntil ? ` through ${date(version.effectiveUntil)}` : " · Current version"}</CardDescription></div><StatusBadge value={version.effectiveUntil ? "CLOSED" : "ACTIVE"} /></div></CardHeader><CardContent className="space-y-4 pt-4"><p className="text-sm leading-6">{value(version, "content")}</p>{version.clauses.length > 0 && <div className="grid gap-3 md:grid-cols-2">{version.clauses.map((clause) => <div key={clause.id} className="rounded-md border p-3"><p className="text-xs text-muted-foreground">Section {value(clause, "section")}</p><p className="mt-1 text-sm font-medium">{value(clause, "title")}</p><p className="mt-1 text-sm leading-5 text-muted-foreground">{value(clause, "content")}</p></div>)}</div>}{version.sourceDocument && <p className="text-xs text-muted-foreground">Source document: {value(version.sourceDocument, "name")}</p>}</CardContent></Card>)}</div><Button variant="outline" render={<Link to="/policies" />}>Back to policies<ArrowRight /></Button>
  </div>;
}
