import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Activity, ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { API_URL } from "@/config/constants";
import type { ChargebackStreamEvent } from "@/core-api/types";
import { useDisputeRunQuery } from "@/hooks/query/use-dispute-run-query";
import { useDisputeApprovalMutation } from "@/hooks/query/use-dispute-approval-mutation";
import { DisputeSimulationForm } from "@/components/disputes/dispute-simulation-form";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { useDisputeOverviewQuery, useDisputesQuery } from "@/hooks/query/use-disputes-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";

const eventTypes = [
  "connected",
  "chargeback.dispute.received",
  "chargeback.dispute.reconciled",
  "chargeback.investigation.started",
  "chargeback.evidence.collected",
  "chargeback.evidence.requested",
  "chargeback.finding.created",
  "chargeback.contradiction.detected",
  "chargeback.resolution.proposed",
  "chargeback.response.submitted",
  "dispute.processing.started",
  "dispute.processing.ended",
  "dispute.processing.failed",
  "dispute.participant.active",
  "dispute.participant.inactive",
  "dispute.participant.message",
  "dispute.approval.required",
  "dispute.approval.decided",
  "dispute.step.started",
  "dispute.step.completed",
];

function eventLabel(value: string) {
  return value.replace(/^chargeback\./, "").replaceAll(".", " ").replace(/^./, (letter) => letter.toUpperCase());
}

function eventSummary(event: ChargebackStreamEvent) {
  const data = typeof event.data === "object" && event.data !== null
    ? event.data as Record<string, unknown>
    : {};

  if (event.type === "chargeback.investigation.started") return "The coordinator started reviewing this case.";
  if (event.type === "dispute.processing.started") return "Dispute processing started.";
  if (event.type === "dispute.processing.ended") return "Dispute processing completed.";
  if (event.type === "dispute.processing.failed") return String(data.message ?? "The investigation stopped after an agent error.");
  if (event.type === "dispute.approval.required") return "A human decision is needed before provider submission.";
  if (event.type === "dispute.approval.decided") return `Human reviewer ${String(data.decision ?? "responded")} the response.`;
  if (event.type === "chargeback.dispute.received") {
    const amount = typeof data.amountMinor === "number" && typeof data.currency === "string"
      ? ` for ${(data.amountMinor / 100).toLocaleString(undefined, { style: "currency", currency: data.currency })}`
      : "";
    return `Dispute received${amount}.`;
  }

  for (const key of ["summary", "message", "finding", "description", "status"]) {
    if (typeof data[key] === "string" && data[key].trim()) {
      return data[key].trim().slice(0, 140);
    }
  }
  if (typeof data.agentName === "string") return `${data.agentName} completed a step.`;
  return "Investigation progress recorded.";
}

function mergeStreamEvents(current: ChargebackStreamEvent[], incoming: ChargebackStreamEvent[]) {
  const events = new Map(current.map((event) => [event.id, event]));
  for (const event of incoming) events.set(event.id, event);
  return [...events.values()].sort((left, right) => (left.recordedAt ?? "").localeCompare(right.recordedAt ?? ""));
}

function eventData(event: ChargebackStreamEvent | undefined) {
  return event && typeof event.data === "object" && event.data !== null
    ? event.data as Record<string, unknown>
    : {};
}

function processingStatus(events: ChargebackStreamEvent[]) {
  let status: "not_started" | "running" | "awaiting_approval" | "completed" | "failed" = "not_started";
  const decisions = new Set(events.filter((event) => event.type === "dispute.approval.decided").map((event) => eventData(event).approvalId));
  for (const event of events) {
    if (event.type === "dispute.processing.started") status = "running";
    if (event.type === "dispute.processing.ended") status = "completed";
    if (event.type === "dispute.processing.failed") status = "failed";
    if (event.type === "dispute.approval.required" && !decisions.has(eventData(event).approvalId)) status = "awaiting_approval";
    if (event.type === "dispute.approval.decided" && status === "awaiting_approval") status = "running";
  }
  return status;
}

function disputeFromRun(events: ChargebackStreamEvent[]) {
  const received = events.find((event) => event.type === "chargeback.dispute.received");
  const rawPayload = eventData(received).rawPayload;
  const dispute = typeof rawPayload === "object" && rawPayload !== null
    ? (rawPayload as Record<string, unknown>).dispute
    : undefined;
  return typeof dispute === "object" && dispute !== null ? dispute as Record<string, unknown> : undefined;
}

function eventRecords(events: ChargebackStreamEvent[], types: string[]) {
  return events.filter((event) => types.includes(event.type));
}

function hasCompletedRunStep(events: ChargebackStreamEvent[], stepName: string) {
  const expected = stepName.toLowerCase();
  return events.some((event) => event.type === "dispute.step.completed" && String(eventData(event).stepName ?? "").toLowerCase().includes(expected));
}

function ArtifactSection({ title, description, events, isDiscovering }: {
  title: string;
  description: string;
  events: ChargebackStreamEvent[];
  isDiscovering: boolean;
}) {
  return <Card className="h-full rounded-lg shadow-none"><CardHeader className="flex flex-row items-start justify-between gap-3 border-b pb-4"><div><CardTitle>{title}</CardTitle><CardDescription className="mt-1">{description}</CardDescription></div><span className="rounded-md bg-muted px-2 py-1 text-xs font-medium tabular-nums">{events.length}</span></CardHeader><CardContent className="space-y-3 pt-4">{events.length === 0 && isDiscovering ? <div className="space-y-3" aria-label={`Loading ${title.toLowerCase()}`}><div className="rounded-md border p-3"><Skeleton className="h-4 w-36" /><Skeleton className="mt-3 h-3 w-full" /><Skeleton className="mt-2 h-3 w-2/3" /><p className="mt-3 text-xs text-indigo-300 dark:text-indigo-300">Generating</p></div><div className="rounded-md border p-3"><Skeleton className="h-4 w-28" /><Skeleton className="mt-3 h-3 w-4/5" /><p className="mt-3 text-xs text-muted-foreground">Queued</p></div></div> : events.length === 0 ? <p className="py-4 text-sm text-muted-foreground">No {title.toLowerCase()} recorded in this run.</p> : events.map((event) => {
    const data = eventData(event);
    const titleText = [data.title, data.name, data.evidenceType, data.findingType, data.resolutionType, data.type].find((value) => typeof value === "string" && value.trim()) as string | undefined ?? eventLabel(event.type);
    const participant = typeof data.agentName === "string" ? data.agentName : typeof data.participantName === "string" ? data.participantName : undefined;
    const summary = [data.summary, data.description, data.finding, data.rationale, data.recommendation, data.response, data.details, data.content].find((value) => typeof value === "string" && value.trim()) as string | undefined;
    const metaKeys = ["status", "severity", "confidence", "category", "source", "evidenceType", "outcome", "decision"];
    const metadata = metaKeys.flatMap((key) => {
      const value = data[key];
      if (typeof value !== "string" && typeof value !== "number") return [];
      const display = key === "confidence" && typeof value === "number" && value >= 0 && value <= 1 ? `${Math.round(value * 100)}%` : String(value);
      return [{ key, display }];
    });
    return <article key={event.id} className="rounded-md border bg-card p-3.5"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="font-medium leading-5">{titleText}</p>{participant && <p className="mt-1 text-xs font-medium text-indigo-300 dark:text-indigo-300">{participant}</p>}</div><time className="shrink-0 text-right text-[11px] leading-4 text-muted-foreground">{formatTimestamp(event.recordedAt)}</time></div><p className="mt-3 line-clamp-4 whitespace-pre-wrap text-sm leading-5 text-foreground/80">{summary ?? eventSummary(event)}</p>{metadata.length > 0 && <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 border-t pt-3">{metadata.map(({ key, display }) => <div key={key} className="min-w-0"><dt className="text-[10px] uppercase tracking-wide text-muted-foreground">{key.replaceAll(/([A-Z])/g, " $1")}</dt><dd className="truncate text-xs font-medium capitalize" title={display}>{display.replaceAll("_", " ")}</dd></div>)}</dl>}<details className="mt-3 border-t pt-3"><summary className="cursor-pointer text-xs font-medium text-indigo-300 hover:text-indigo-200 dark:text-indigo-300">View raw response</summary><pre className="mt-2 max-h-64 overflow-auto rounded-md bg-muted p-3 text-[11px] leading-5">{formatDetail(event.data)}</pre></details></article>;
  })}</CardContent></Card>;
}

type TimelineEntry = {
  key: string;
  title: string;
  participant?: string;
  status?: string;
  startedAt?: string;
  endedAt?: string;
  durationMs?: number;
  input?: unknown;
  result?: unknown;
  summary: string;
};

function simulationTimeline(events: ChargebackStreamEvent[]): TimelineEntry[] {
  const entries = new Map<string, TimelineEntry>();
  for (const event of events) {
    const data = typeof event.data === "object" && event.data !== null ? event.data as Record<string, unknown> : {};
    const stepId = typeof data.stepId === "string"
      ? data.stepId
      : event.type.startsWith("dispute.processing.") ? "dispute-processing" : event.id;
    const entry = entries.get(stepId) ?? {
      key: stepId,
      title: typeof data.stepName === "string" ? data.stepName : eventLabel(event.type),
      summary: eventSummary(event),
    };
    if (typeof data.participantName === "string" || typeof data.agentName === "string") entry.participant = String(data.participantName ?? data.agentName);
    if (typeof data.status === "string") entry.status = data.status;
    if (typeof data.startedAt === "string") entry.startedAt = data.startedAt;
    if (typeof data.endedAt === "string") entry.endedAt = data.endedAt;
    if (typeof data.durationMs === "number") entry.durationMs = data.durationMs;
    if (data.input !== undefined) entry.input = data.input;
    if (data.result !== undefined) entry.result = data.result;
    if (typeof data.message === "string") entry.result = data.message;
    if (event.type === "dispute.processing.started" || event.type === "dispute.processing.ended") {
      entry.title = "Dispute processing";
      entry.status = event.type.endsWith("started") ? "started" : "completed";
      if (event.type.endsWith("started") && typeof data.startedAt === "string") entry.startedAt = data.startedAt;
      if (event.type.endsWith("ended") && typeof data.endedAt === "string") entry.endedAt = data.endedAt;
    }
    entries.set(stepId, entry);
  }
  return [...entries.values()];
}

function formatTimestamp(value: string | undefined) {
  if (!value) return "Waiting";
  const parsed = new Date(value);
  return Number.isNaN(parsed.valueOf()) ? "—" : new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "medium" }).format(parsed);
}

function formatDetail(value: unknown) {
  if (typeof value === "string") return value;
  if (value === undefined) return "";
  try { return JSON.stringify(value, null, 2); } catch { return String(value); }
}

function mutationErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: unknown } } }).response;
    if (typeof response?.data?.message === "string") return response.data.message;
  }
  return error instanceof Error ? error.message : "Could not create the dispute.";
}

function field(record: Record<string, unknown> | null | undefined, key: string, fallback = "—") {
  const value = record?.[key];
  return value === null || value === undefined || value === "" ? fallback : String(value);
}

function disputeMoney(minor: unknown, currency: unknown) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: String(currency ?? "USD") }).format((typeof minor === "number" ? minor : 0) / 100);
}

function formatDate(value: unknown) {
  if (typeof value !== "string") return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.valueOf()) ? "—" : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(parsed);
}

function CaseReviewSkeleton() {
  return <div className="space-y-4" aria-label="Loading dispute case details"><div className="grid gap-4 sm:grid-cols-3">{[0, 1, 2].map((item) => <Card key={item} className="rounded-lg shadow-none"><CardContent className="space-y-3 p-5"><Skeleton className="h-3 w-24" /><Skeleton className="h-6 w-40" /></CardContent></Card>)}</div><Card className="rounded-lg shadow-none"><CardContent className="space-y-3 p-5"><Skeleton className="h-4 w-32" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /></CardContent></Card><div className="grid gap-4 lg:grid-cols-2">{[0, 1].map((item) => <Card key={item} className="rounded-lg shadow-none"><CardContent className="space-y-3 p-5"><Skeleton className="h-4 w-36" /><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></CardContent></Card>)}</div></div>;
}

export function SimulateDisputePage() {
  return <div className="mx-auto w-full max-w-3xl space-y-6"><div><p className="mb-2 text-sm text-muted-foreground"><Link to="/disputes" className="hover:text-indigo-300">Disputes</Link><span className="mx-2">/</span>New investigation</p><h1 className="text-2xl font-semibold tracking-tight">Simulate a dispute</h1><p className="mt-1 text-sm text-muted-foreground">Choose the payment and reason, then describe the cardholder claim.</p></div><DisputeSimulationForm /></div>;
}

export function DisputesPage() {
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const query = useDisputesQuery(50, offset);
  const disputes = (query.data?.items ?? []).filter((dispute) => `${dispute.id} ${dispute.customerName ?? ""} ${dispute.reasonName ?? ""} ${dispute.orderReference ?? ""}`.toLowerCase().includes(search.toLowerCase()));
  const total = query.data?.total ?? 0;
  return <div className="space-y-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-2xl font-semibold tracking-tight">Disputes</h1><p className="mt-1 text-sm text-muted-foreground">Review customer claims, response deadlines, and investigation progress.</p></div><Button className="bg-indigo-500 text-white hover:bg-indigo-400" render={<Link to="/disputes/simulate" />}>Simulate dispute<ArrowRight /></Button></div><Card className="rounded-lg shadow-none"><CardHeader className="flex flex-row flex-wrap items-end justify-between gap-3 border-b pb-4"><div><CardTitle>Case queue</CardTitle><CardDescription>{total.toLocaleString()} disputes</CardDescription></div><Input aria-label="Search disputes" placeholder="Search customer, reason, or order" value={search} onChange={(event) => setSearch(event.target.value)} className="h-9 w-full sm:w-72" /></CardHeader>{query.isPending && <CardContent className="py-10 text-sm text-muted-foreground">Loading disputes…</CardContent>}{query.isError && <CardContent role="alert" className="py-10 text-sm text-destructive">Could not load disputes.</CardContent>}{disputes.length > 0 && <CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Case</TableHead><TableHead>Customer</TableHead><TableHead>Reason</TableHead><TableHead>Status</TableHead><TableHead>Response due</TableHead><TableHead className="text-right">Amount</TableHead><TableHead /></TableRow></TableHeader><TableBody>{disputes.map((dispute) => <TableRow key={dispute.id}><TableCell><p className="font-medium">{String(dispute.externalId ?? dispute.id)}</p><p className="text-xs text-muted-foreground">Order {String(dispute.orderReference ?? "—")}</p></TableCell><TableCell>{String(dispute.customerName ?? "Unknown customer")}</TableCell><TableCell>{String(dispute.reasonName ?? "Dispute reason")}</TableCell><TableCell><StatusBadge value={dispute.providerStatus} /></TableCell><TableCell>{formatDate(dispute.responseDeadline)}</TableCell><TableCell className="text-right tabular-nums">{disputeMoney(dispute.amountMinor, dispute.currency)}</TableCell><TableCell className="text-right"><Button variant="link" size="sm" render={<Link to={`/disputes/${encodeURIComponent(dispute.id)}`} />}>Review<ArrowRight /></Button></TableCell></TableRow>)}</TableBody></Table></CardContent>}{!query.isPending && !query.isError && disputes.length === 0 && <CardContent className="py-10 text-sm text-muted-foreground">No disputes match this search.</CardContent>}<div className="flex items-center justify-between border-t px-5 py-3"><p className="text-xs text-muted-foreground">{total === 0 ? 0 : offset + 1}–{Math.min(offset + 50, total)} of {total}</p><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => setOffset(Math.max(0, offset - 50))} disabled={!offset}><ArrowLeft />Previous</Button><Button variant="outline" size="sm" onClick={() => setOffset(offset + 50)} disabled={!query.data || offset + 50 >= total}>Next<ArrowRight /></Button></div></div></Card></div>;
}

export function DisputesRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useDisputeOverviewQuery(recordId);
  const runQuery = useDisputeRunQuery(recordId);
  const approvalMutation = useDisputeApprovalMutation(recordId);
  const [runEvents, setRunEvents] = useState<ChargebackStreamEvent[]>([]);
  const [approvalNote, setApprovalNote] = useState("");
  const [logOpen, setLogOpen] = useState(false);
  const [demoDetailsReady, setDemoDetailsReady] = useState(false);
  useEffect(() => {
    if (runQuery.data) setRunEvents((current) => mergeStreamEvents(current, runQuery.data.events));
  }, [runQuery.data]);
  const isSavedDemo = runEvents.some((event) => event.type === "chargeback.dispute.received" && eventData(event).provider === "demo")
    || Boolean(query.data?.investigationEvents.some((event) => event.type === "chargeback.dispute.received" && eventData(event).provider === "demo"));
  useEffect(() => {
    setDemoDetailsReady(false);
    if (!isSavedDemo) return;
    const timer = window.setTimeout(() => setDemoDetailsReady(true), 3500);
    return () => window.clearTimeout(timer);
  }, [isSavedDemo, recordId]);
  useEffect(() => {
    if (!recordId) return;
    const streamUrl = new URL("/api/v1/chargebacks/events/stream", API_URL || window.location.origin);
    streamUrl.searchParams.set("disputeId", recordId);
    const stream = new EventSource(streamUrl.toString());
    const listeners = eventTypes.filter((type) => type !== "connected").map((type) => {
      const listener = (message: MessageEvent<string>) => {
        try { setRunEvents((current) => mergeStreamEvents(current, [JSON.parse(message.data) as ChargebackStreamEvent])); }
        catch { /* Ignore malformed frames and keep receiving run updates. */ }
      };
      stream.addEventListener(type, listener as EventListener);
      return () => stream.removeEventListener(type, listener as EventListener);
    });
    return () => { listeners.forEach((remove) => remove()); stream.close(); };
  }, [recordId]);
  if (query.isError && !query.data) return <p role="alert" className="py-10 text-sm text-destructive">Could not load this dispute.</p>;
  const allRunEvents = mergeStreamEvents(query.data?.investigationEvents ?? [], runEvents);
  const merchant = query.data?.merchant ?? null;
  const reasonCode = query.data?.reasonCode ?? null;
  const requirementSet = query.data?.requirementSet ?? null;
  const requirements = query.data?.requirements ?? [];
  const payment = query.data?.payment ?? null;
  const customer = query.data?.customer ?? null;
  const customerAddresses = query.data?.customerAddresses ?? [];
  const order = query.data?.order ?? null;
  const disputeEvents = query.data?.disputeEvents ?? [];
  const dispute = query.data?.dispute ?? (disputeFromRun(allRunEvents) as NonNullable<typeof query.data>["dispute"] | undefined);
  const status = processingStatus(allRunEvents);
  const evidenceEvents = eventRecords(allRunEvents, ["chargeback.evidence.collected", "chargeback.evidence.requested"]);
  const findingEvents = eventRecords(allRunEvents, ["chargeback.finding.created", "chargeback.contradiction.detected"]);
  const resolutionEvents = eventRecords(allRunEvents, ["chargeback.resolution.proposed"]);
  const decisions = new Set(allRunEvents.filter((event) => event.type === "dispute.approval.decided").map((event) => eventData(event).approvalId));
  const pendingApprovals = allRunEvents.filter((event) => event.type === "dispute.approval.required" && !decisions.has(eventData(event).approvalId));
  const isDemoRun = allRunEvents.some((event) => event.type === "chargeback.dispute.received" && eventData(event).provider === "demo");
  const isInvestigationActive = status === "running" || status === "awaiting_approval";
  const customerLoading = isDemoRun ? !demoDetailsReady && !hasCompletedRunStep(allRunEvents, "load customer communications") : !customer && isInvestigationActive;
  const paymentLoading = isDemoRun ? !demoDetailsReady && !hasCompletedRunStep(allRunEvents, "load payment") : !payment && isInvestigationActive;
  const orderLoading = isDemoRun ? !demoDetailsReady && !hasCompletedRunStep(allRunEvents, "load order") : !order && isInvestigationActive;
  const deliveryLoading = isDemoRun ? !demoDetailsReady && !hasCompletedRunStep(allRunEvents, "load fulfillment") : !order && isInvestigationActive;
  const failureEvent = allRunEvents.slice().reverse().find((event) => event.type === "dispute.processing.failed");
  const liveStatus = status === "running" ? "Investigation generating case evidence" : status === "awaiting_approval" ? "Waiting for human approval" : status === "completed" ? "Investigation complete" : status === "failed" ? "Investigation stopped" : "Case review";
  async function handleApproval(approvalId: string, decision: "approved" | "rejected") {
    try { await approvalMutation.mutateAsync({ approvalId, input: { decision, note: approvalNote.trim() || undefined } }); setApprovalNote(""); }
    catch { /* Keep the approval card visible for retry. */ }
  }
  if (!dispute) return <div className="space-y-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="mb-2 text-sm text-muted-foreground"><Link to="/disputes" className="hover:text-indigo-300">Disputes</Link><span className="mx-2">/</span>Case review</p><h1 className="text-2xl font-semibold tracking-tight">{recordId}</h1></div><span className="rounded-full bg-indigo-950/30 px-2.5 py-1 text-xs font-medium text-indigo-300 dark:bg-indigo-950/40 dark:text-indigo-300">{liveStatus}</span></div><CaseReviewSkeleton /></div>;
  const policyAcceptances = order?.policyAcceptances ?? [];
  const shipments = order?.shipments ?? [];
  return <div className="space-y-6"><div><p className="mb-2 text-sm text-muted-foreground"><Link to="/disputes" className="hover:text-indigo-300">Disputes</Link><span className="mx-2">/</span>Case review</p><div className="flex flex-wrap items-start justify-between gap-3"><div><h1 className="text-2xl font-semibold tracking-tight">{field(dispute, "externalId", dispute.id)}</h1><p className="mt-1 text-sm text-muted-foreground">{field(reasonCode, "name", "Dispute case")}{customer ? ` · ${field(customer, "firstName")} ${field(customer, "lastName")}` : ""}</p></div><div className="flex items-center gap-2">{isDemoRun && <span className="rounded-md border bg-muted px-2 py-1 text-xs font-medium">Saved run demo</span>}<StatusBadge value={status === "running" ? "investigating" : status === "awaiting_approval" ? "awaiting approval" : status === "completed" ? "investigation complete" : dispute.providerStatus} /><Popover open={logOpen} onOpenChange={setLogOpen}><PopoverTrigger render={<Button variant="outline"><Activity />See live Agent Logs</Button>} /><PopoverContent align="end" className="w-[min(34rem,calc(100vw-2rem))]"><PopoverHeader><PopoverTitle>Live agent logs</PopoverTitle><PopoverDescription>{allRunEvents.length} events · {liveStatus}</PopoverDescription></PopoverHeader><div className="max-h-[65vh] space-y-3 overflow-auto py-2">{allRunEvents.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">Waiting for the investigation to publish its first event…</p> : allRunEvents.slice().reverse().map((event) => { const data = eventData(event); return <div key={event.id} className="rounded-md border p-3"><div className="flex justify-between gap-3"><div><p className="text-sm font-medium">{eventLabel(event.type)}</p>{typeof data.participantName === "string" && <p className="mt-0.5 text-xs text-indigo-300 dark:text-indigo-300">{data.participantName}</p>}</div><time className="shrink-0 text-xs text-muted-foreground">{formatTimestamp(event.recordedAt)}</time></div><p className="mt-2 text-xs leading-5 text-muted-foreground">{eventSummary(event)}</p>{typeof data.message === "string" && <p className="mt-2 whitespace-pre-wrap text-sm">{String(data.message)}</p>}</div>; })}</div></PopoverContent></Popover></div></div></div>
    {(status === "running" || status === "awaiting_approval") && <Card className="rounded-lg border-indigo-900/70 shadow-none dark:border-indigo-900"><CardContent className="flex flex-wrap items-center justify-between gap-3 p-4"><div><p className="text-sm font-medium">{liveStatus}</p><p className="mt-1 text-xs text-muted-foreground">Customer, payment, order, delivery, and evidence details appear here as they are discovered.</p></div></CardContent></Card>}
    {status === "failed" && <Card role="alert" className="rounded-lg border-rose-900/70 bg-rose-950/20 shadow-none"><CardContent className="p-4"><p className="text-sm font-medium text-rose-300">Investigation stopped</p><p className="mt-1 text-sm text-muted-foreground">{String(eventData(failureEvent).message ?? "An agent encountered an error. Check the API logs before retrying.")}</p></CardContent></Card>}
    <div className="grid gap-4 sm:grid-cols-3"><Card className="rounded-lg shadow-none"><CardContent className="p-5"><p className="text-xs text-muted-foreground">Disputed amount</p><p className="mt-1 text-xl font-semibold">{disputeMoney(dispute.amountMinor, dispute.currency)}</p></CardContent></Card><Card className="rounded-lg shadow-none"><CardContent className="p-5"><p className="text-xs text-muted-foreground">Response due</p><p className="mt-1 text-xl font-semibold">{formatDate(dispute.responseDeadline)}</p></CardContent></Card><Card className="rounded-lg shadow-none"><CardContent className="p-5"><p className="text-xs text-muted-foreground">Merchant</p><p className="mt-1 text-xl font-semibold">{merchant ? field(merchant, "name", field(dispute, "merchantId")) : <Skeleton className="mt-2 h-6 w-36" />}</p></CardContent></Card></div>
    <Card className="rounded-lg shadow-none"><CardHeader className="border-b pb-4"><CardTitle>Cardholder claim</CardTitle><CardDescription>{field(reasonCode, "description", "Reason details unavailable")}</CardDescription></CardHeader><CardContent className="pt-4 text-sm leading-6">{field(dispute, "customerClaim", "No claim description recorded.")}</CardContent></Card>
    <div className="grid gap-4 xl:grid-cols-3">
      <ArtifactSection title="Evidence" description="Collected records and open evidence requests." events={evidenceEvents} isDiscovering={status === "running" || status === "awaiting_approval"} />
      <ArtifactSection title="Findings" description="What the investigation established." events={findingEvents} isDiscovering={status === "running" || status === "awaiting_approval"} />
      <ArtifactSection title="Response" description="The recommended action for this dispute." events={resolutionEvents} isDiscovering={status === "running" || status === "awaiting_approval"} />
    </div>
    {pendingApprovals.map((event) => { const approval = eventData(event); const approvalId = String(approval.approvalId ?? ""); return <Card key={event.id} className="rounded-lg border-amber-300 shadow-none dark:border-amber-900"><CardHeader className="border-b border-amber-200 pb-4 dark:border-amber-900"><CardTitle>Human approval required</CardTitle><CardDescription>{approval.demoRun === true ? "This saved run is waiting for a sample review decision. The provider response will not be sent." : String(approval.participantName ?? "The investigation agent") + " paused before the simulated provider response. Review the response and attached run evidence."}</CardDescription></CardHeader><CardContent className="space-y-4 pt-4"><div className="grid gap-4 lg:grid-cols-2"><div><p className="mb-2 text-xs font-medium text-muted-foreground">Proposed response</p><pre className="max-h-64 overflow-auto rounded-md bg-muted p-3 text-xs">{formatDetail(approval.proposedResponse)}</pre></div><div className="space-y-2 text-sm"><p>{Array.isArray(approval.evidence) ? approval.evidence.length : evidenceEvents.length} evidence items · {Array.isArray(approval.findings) ? approval.findings.length : findingEvents.length} findings · {Array.isArray(approval.resolutions) ? approval.resolutions.length : resolutionEvents.length} resolutions attached</p><details><summary className="cursor-pointer text-xs font-medium text-indigo-300 dark:text-indigo-300">Review complete case context</summary><pre className="mt-2 max-h-52 overflow-auto rounded bg-muted p-3 text-xs">{formatDetail(approval.caseContext)}</pre></details></div></div><div className="space-y-2"><Label htmlFor={`case-approval-note-${approvalId}`}>Reviewer note</Label><Textarea id={`case-approval-note-${approvalId}`} rows={2} maxLength={2000} value={approvalNote} onChange={(input) => setApprovalNote(input.target.value)} placeholder="Optional decision note" /></div>{approvalMutation.isError && <p role="alert" className="text-sm text-destructive">{mutationErrorMessage(approvalMutation.error)}</p>}<div className="flex gap-2"><Button className="bg-indigo-500 text-white hover:bg-indigo-400" disabled={approvalMutation.isPending} onClick={() => void handleApproval(approvalId, "approved")}><Check />Approve response</Button><Button variant="destructive" disabled={approvalMutation.isPending} onClick={() => void handleApproval(approvalId, "rejected")}><X />Reject response</Button></div></CardContent></Card>; })}
    <div className="grid gap-4 lg:grid-cols-2"><Card className="rounded-lg shadow-none"><CardHeader className="border-b pb-4"><CardTitle>Evidence to review</CardTitle><CardDescription>{requirementSet ? `Requirement set v${field(requirementSet, "version")}` : "Response checklist for this dispute reason."}</CardDescription></CardHeader><CardContent className="space-y-2 pt-4">{requirements.length === 0 && (status === "running" || status === "awaiting_approval") ? <div className="space-y-3"><Skeleton className="h-14 w-full" /><Skeleton className="h-14 w-full" /></div> : requirements.length === 0 ? <p className="text-sm text-muted-foreground">No evidence requirements are recorded.</p> : requirements.map((requirement) => <div key={requirement.id} className="flex items-start gap-3 rounded-md border p-3"><span className={`mt-1 size-2 shrink-0 rounded-full ${requirement.required ? "bg-indigo-500" : "bg-muted-foreground/40"}`} /><div><p className="text-sm font-medium">{field(requirement, "description")}</p><p className="mt-0.5 text-xs text-muted-foreground">{field(requirement, "evidenceCategory").toLowerCase().replaceAll("_", " ")}{requirement.required ? " · Required" : " · Optional"}</p></div></div>)}</CardContent></Card>
      <Card className="rounded-lg shadow-none"><CardHeader className="border-b pb-4"><CardTitle>Customer & payment</CardTitle><CardDescription>Related customer profile, order, and charge.</CardDescription></CardHeader><CardContent className="space-y-3 pt-4">
        {customerLoading ? <div className="space-y-2 rounded-md border p-3" aria-label="Loading customer profile"><Skeleton className="h-4 w-40" /><Skeleton className="h-3 w-52" /><p className="text-xs text-indigo-300 dark:text-indigo-300">Finding customer profile</p></div> : customer ? <div className="rounded-md border p-3 text-sm"><Link className="font-medium text-indigo-300 hover:underline" to={"/customers/" + encodeURIComponent(customer.id)}>{field(customer, "firstName")} {field(customer, "lastName")}</Link><p className="mt-1 text-muted-foreground">{field(customer, "email")}</p>{customerAddresses.slice(0, 2).map((address) => <p key={address.id} className="text-xs text-muted-foreground">{field(address, "addressLine1")}, {field(address, "city")}</p>)}</div> : <p className="text-sm text-muted-foreground">Customer details are not linked.</p>}
        {paymentLoading ? <div className="space-y-2 rounded-md border p-3" aria-label="Loading payment details"><Skeleton className="h-4 w-36" /><Skeleton className="h-3 w-28" /><p className="text-xs text-indigo-300 dark:text-indigo-300">Checking payment records</p></div> : payment ? <Link to={"/payments/" + encodeURIComponent(payment.id)} className="flex items-center justify-between gap-3 rounded-md border p-3 text-sm hover:bg-muted/50"><span><span className="block font-medium">Payment {field(payment, "externalId", payment.id)}</span><span className="text-xs text-muted-foreground">{disputeMoney(payment.amountMinor, payment.currency)}</span></span><StatusBadge value={payment.status} /></Link> : <p className="text-sm text-muted-foreground">No payment record is linked.</p>}
        {order && !orderLoading && <Link to={"/orders/" + encodeURIComponent(order.id)} className="flex items-center justify-between gap-3 rounded-md border p-3 text-sm hover:bg-muted/50"><span><span className="block font-medium">Order {field(order, "externalId", order.id)}</span><span className="text-xs text-muted-foreground">{order.items.length} items</span></span><ArrowRight className="size-4 text-muted-foreground" /></Link>}
        {orderLoading && <div className="space-y-2 rounded-md border p-3" aria-label="Loading order details"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-24" /><p className="text-xs text-indigo-300 dark:text-indigo-300">Gathering order details</p></div>}
      </CardContent></Card></div>
    {(order || orderLoading || deliveryLoading) && <Card className="rounded-lg shadow-none"><CardHeader className="border-b pb-4"><CardTitle>Order & delivery evidence</CardTitle><CardDescription>Products purchased and recorded shipping activity.</CardDescription></CardHeader><CardContent className="grid gap-4 pt-4 lg:grid-cols-2">
      <div className="space-y-2">{orderLoading ? <div className="space-y-3 rounded-md border p-3" aria-label="Loading order items"><Skeleton className="h-4 w-36" /><Skeleton className="h-14 w-full" /><Skeleton className="h-14 w-full" /><p className="text-xs text-indigo-300 dark:text-indigo-300">Gathering order details</p></div> : order ? order.items.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 rounded-md border p-3 text-sm"><span><span className="block font-medium">{item.product ? field(item.product, "name") : field(item, "productName")}</span><span className="text-xs text-muted-foreground">Quantity {field(item, "quantity")}</span></span><span className="tabular-nums">{disputeMoney(item.totalMinor, item.currency)}</span></div>) : <p className="text-sm text-muted-foreground">No order is linked to this dispute.</p>}</div>
      <div className="space-y-3">{deliveryLoading ? <div className="space-y-3 rounded-md border p-3" aria-label="Loading delivery information"><Skeleton className="h-4 w-32" /><Skeleton className="h-14 w-full" /><p className="text-xs text-indigo-300 dark:text-indigo-300">Checking fulfillment and delivery</p></div> : !order ? <p className="text-sm text-muted-foreground">No delivery information is linked.</p> : shipments.length === 0 ? <p className="text-sm text-muted-foreground">No shipment record is linked to this order.</p> : shipments.map((shipment) => <div key={shipment.id} className="rounded-md border p-3"><div className="flex items-center justify-between gap-3 text-sm"><span className="font-medium">{field(shipment, "carrier")} · {field(shipment, "trackingNumber")}</span><StatusBadge value={shipment.status} /></div><div className="mt-2 space-y-2">{shipment.events.slice(0, 3).map((event) => <p key={event.id} className="text-xs text-muted-foreground">{field(event, "description")} · {formatDate(event.occurredAt)}</p>)}{shipment.confirmations.map((confirmation) => <p key={confirmation.id} className="text-xs text-muted-foreground">Delivery confirmed by {field(confirmation, "confirmationMethod").toLowerCase()} · {formatDate(confirmation.deliveredAt)}</p>)}</div></div>)}</div>
    </CardContent></Card>}
    <Card className="rounded-lg shadow-none"><CardHeader className="border-b pb-4"><CardTitle>Policies accepted at checkout</CardTitle><CardDescription>Policy version and clauses captured with the order.</CardDescription></CardHeader><CardContent className="space-y-3 pt-4">{policyAcceptances.length === 0 ? <p className="text-sm text-muted-foreground">No policy acceptance records are linked to this order.</p> : policyAcceptances.map(({ acceptance, version, policy, clauses }) => <div key={acceptance.id} className="rounded-md border p-3"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-medium">{field(policy, "name", "Policy")}{version ? ` · v${field(version, "version")}` : ""}</p><p className="text-xs text-muted-foreground">Accepted {formatDate(acceptance.acceptedAt)}</p></div>{version && <p className="mt-2 text-sm text-muted-foreground">{field(version, "content")}</p>}{clauses.map((clause) => <p key={clause.id} className="mt-2 text-xs text-muted-foreground"><strong>{field(clause, "title")}:</strong> {field(clause, "content")}</p>)}</div>)}</CardContent></Card>
    <Card className="rounded-lg shadow-none"><CardHeader className="border-b pb-4"><CardTitle>Case activity</CardTitle><CardDescription>Provider and live investigation events.</CardDescription></CardHeader><CardContent className="divide-y p-0">{[...disputeEvents.map((event) => ({ id: event.id, title: field(event, "type").toLowerCase().replaceAll("_", " "), detail: `${field(event, "previousStatus", "Created")} → ${field(event, "newStatus")}`, at: event.occurredAt })), ...allRunEvents.map((event) => ({ id: event.id, title: eventLabel(event.type), detail: eventSummary(event), at: event.recordedAt }))].map((event) => <div key={event.id} className="flex items-start justify-between gap-4 px-5 py-3"><div><p className="text-sm font-medium capitalize">{event.title}</p><p className="mt-0.5 text-xs text-muted-foreground">{event.detail}</p></div><span className="shrink-0 text-xs text-muted-foreground">{formatDate(event.at)}</span></div>)}</CardContent></Card>
  </div>;
}
