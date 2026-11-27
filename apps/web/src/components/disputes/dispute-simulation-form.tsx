import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { usePaymentsQuery } from "@/hooks/query/use-payments-query";
import { useDisputeReasonCodesQuery } from "@/hooks/query/use-dispute-reason-codes-query";
import { useCreateDisputeMutation } from "@/hooks/query/use-disputes-query";
import { useDisputeDemoRunMutation } from "@/hooks/query/use-dispute-demo-run-mutation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function money(minor: unknown, currency: unknown) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: String(currency ?? "USD") }).format((typeof minor === "number" ? minor : 0) / 100);
}

function errorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: unknown } } }).response;
    if (typeof response?.data?.message === "string") return response.data.message;
  }
  return error instanceof Error ? error.message : "Could not start the dispute investigation.";
}

export function DisputeSimulationForm({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate();
  const paymentsQuery = usePaymentsQuery(100, 0);
  const reasonCodesQuery = useDisputeReasonCodesQuery(100, 0);
  const createMutation = useCreateDisputeMutation();
  const demoRunMutation = useDisputeDemoRunMutation();
  const [paymentId, setPaymentId] = useState("");
  const [reasonCodeId, setReasonCodeId] = useState("");
  const [customerClaim, setCustomerClaim] = useState("");
  const selectedPayment = paymentsQuery.data?.items.find((payment) => payment.id === paymentId);
  const selectedReason = reasonCodesQuery.data?.items.find((reason) => reason.id === reasonCodeId);
  const isPending = createMutation.isPending || demoRunMutation.isPending;
  const canSubmit = Boolean(paymentId) && customerClaim.trim().length >= 10 && !isPending && !paymentsQuery.isError;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const result = await createMutation.mutateAsync({ paymentId, reasonCodeId: reasonCodeId || undefined, customerClaim });
      navigate("/disputes/" + encodeURIComponent(String(result.dispute.id)), { replace: true });
    } catch {
      // Keep the form open and show the create error inline.
    }
  }

  async function handleDemoRun() {
    try {
      const result = await demoRunMutation.mutateAsync({ paymentId: paymentId || undefined, reasonCodeId: reasonCodeId || undefined, customerClaim: customerClaim.trim() || undefined });
      navigate("/disputes/" + encodeURIComponent(String(result.dispute.id)), { replace: true });
    } catch {
      // Keep the form open and show the demo replay error inline.
    }
  }

  return <Card className="rounded-lg shadow-none">
    <CardHeader className="border-b pb-4"><CardTitle>{compact ? "Start an investigation" : "Investigation details"}</CardTitle><CardDescription>{compact ? "Run the saved demo instantly, or configure a new AI investigation." : "Run the saved case without an OpenAI key, or configure an AI investigation."}</CardDescription></CardHeader>
    <CardContent className="pt-5"><form className="space-y-5" onSubmit={handleSubmit}>
      <div className={compact ? "grid gap-4 sm:grid-cols-2" : "space-y-5"}>
        <div className="space-y-2"><Label htmlFor={compact ? "dashboard-paymentId" : "paymentId"}>Payment reference</Label><select id={compact ? "dashboard-paymentId" : "paymentId"} required value={paymentId} onChange={(event) => setPaymentId(event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/20" disabled={paymentsQuery.isPending || isPending}><option value="">{paymentsQuery.isPending ? "Loading payment references…" : "Select a payment reference"}</option>{(paymentsQuery.data?.items ?? []).map((payment) => <option key={payment.id} value={payment.id}>{String(payment.externalId ?? payment.id)} · {money(payment.amountMinor, payment.currency)} · {String(payment.status)}</option>)}</select>{selectedPayment && <p className="text-xs text-muted-foreground">Reference {String(selectedPayment.externalId ?? selectedPayment.id)} · {money(selectedPayment.amountMinor, selectedPayment.currency)}</p>}{paymentsQuery.isError && <p role="alert" className="text-sm text-destructive">Could not load payment references.</p>}</div>
        <div className="space-y-2"><Label htmlFor={compact ? "dashboard-reasonCodeId" : "reasonCodeId"}>Dispute reason</Label><select id={compact ? "dashboard-reasonCodeId" : "reasonCodeId"} value={reasonCodeId} onChange={(event) => setReasonCodeId(event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/20" disabled={reasonCodesQuery.isPending || isPending}><option value="">{reasonCodesQuery.isPending ? "Loading dispute reasons…" : "Use default reason"}</option>{(reasonCodesQuery.data?.items ?? []).map((reason) => <option key={reason.id} value={reason.id}>{String(reason.name)}{typeof reason.code === "string" && reason.code.length > 0 ? " · " + reason.code : ""}</option>)}</select>{typeof selectedReason?.description === "string" && selectedReason.description.length > 0 && <p className="text-xs text-muted-foreground">{String(selectedReason.description)}</p>}{reasonCodesQuery.isError && <p className="text-sm text-muted-foreground">Reason codes could not be loaded; the default reason will be used.</p>}</div>
      </div>
      <div className="space-y-2"><Label htmlFor={compact ? "dashboard-customerClaim" : "customerClaim"}>Cardholder claim</Label><Textarea id={compact ? "dashboard-customerClaim" : "customerClaim"} required minLength={10} maxLength={2000} value={customerClaim} onChange={(event) => setCustomerClaim(event.target.value)} placeholder="Describe why the cardholder is disputing this payment" rows={compact ? 3 : 5} disabled={isPending} /></div>
      {createMutation.isError && <p role="alert" className="text-sm text-destructive">{errorMessage(createMutation.error)}</p>}{demoRunMutation.isError && <p role="alert" className="text-sm text-destructive">{errorMessage(demoRunMutation.error)}</p>}
      <div className="flex flex-wrap justify-end gap-2"><Button type="button" variant="outline" onClick={() => void handleDemoRun()} disabled={isPending}>{demoRunMutation.isPending ? "Loading saved run…" : "Run saved demo"}</Button><Button type="submit" className="bg-indigo-500 text-white hover:bg-indigo-400" disabled={!canSubmit}>{createMutation.isPending ? "Starting investigation…" : <><ShieldAlert />Create dispute</>}</Button></div>
    </form></CardContent>
  </Card>;
}
