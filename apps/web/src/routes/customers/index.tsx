import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, MapPin, ShoppingBag, Wallet } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { SyntheticRecord } from "@/core-api/types";
import { useCustomerOverviewQuery, useCustomersQuery } from "@/hooks/query/use-customers-query";

function value(record: SyntheticRecord, key: string, fallback = "—") {
  const result = record[key];
  return result === null || result === undefined || result === "" ? fallback : String(result);
}

function money(minor: unknown, currency: unknown = "USD") {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: String(currency), maximumFractionDigits: 2 })
    .format((typeof minor === "number" ? minor : 0) / 100);
}

function date(value: unknown) {
  if (typeof value !== "string") return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.valueOf()) ? "—" : new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(parsed);
}

export function CustomersPage() {
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const query = useCustomersQuery(50, offset);
  const customers = (query.data?.items ?? []).filter((customer) =>
    `${customer.fullName ?? ""} ${customer.email ?? ""}`.toLowerCase().includes(search.toLowerCase()),
  );
  const total = query.data?.total ?? 0;

  return <div className="space-y-6">
    <div><h1 className="text-2xl font-semibold tracking-tight">Customers</h1><p className="mt-1 text-sm text-muted-foreground">Customer profiles, purchase history, and contact details in one place.</p></div>
    <Card className="rounded-lg shadow-none">
      <CardHeader className="flex flex-row flex-wrap items-end justify-between gap-3 border-b pb-4"><div><CardTitle>Customer directory</CardTitle><CardDescription>{total.toLocaleString()} customer profiles</CardDescription></div><Input aria-label="Search customers" placeholder="Search name or email" value={search} onChange={(event) => setSearch(event.target.value)} className="h-9 w-full sm:w-64" /></CardHeader>
      {query.isPending && <CardContent className="py-10 text-sm text-muted-foreground">Loading customers…</CardContent>}
      {query.isError && <CardContent role="alert" className="py-10 text-sm text-destructive">Could not load customers.</CardContent>}
      {!query.isPending && !query.isError && customers.length === 0 && <CardContent className="py-10 text-sm text-muted-foreground">No customers match this search.</CardContent>}
      {customers.length > 0 && <CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Customer</TableHead><TableHead>Orders</TableHead><TableHead>Lifetime value</TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader><TableBody>{customers.map((customer) => <TableRow key={customer.id}><TableCell><p className="font-medium">{String(customer.fullName ?? `${customer.firstName} ${customer.lastName}`)}</p><p className="mt-0.5 text-xs text-muted-foreground">{String(customer.email ?? "")}</p></TableCell><TableCell>{Number(customer.orderCount ?? 0).toLocaleString()}</TableCell><TableCell className="tabular-nums">{money(customer.lifetimeValueMinor)}</TableCell><TableCell><StatusBadge value={customer.status} /></TableCell><TableCell className="text-right"><Button variant="link" size="sm" render={<Link to={`/customers/${encodeURIComponent(customer.id)}`} />}>Profile<ArrowRight /></Button></TableCell></TableRow>)}</TableBody></Table></CardContent>}
      <div className="flex items-center justify-between border-t px-5 py-3"><p className="text-xs text-muted-foreground">{total === 0 ? 0 : offset + 1}–{Math.min(offset + 50, total)} of {total}</p><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => setOffset(Math.max(offset - 50, 0))} disabled={!offset || query.isPending}><ArrowLeft />Previous</Button><Button variant="outline" size="sm" onClick={() => setOffset(offset + 50)} disabled={!query.data || offset + 50 >= total || query.isPending}>Next<ArrowRight /></Button></div></div>
    </Card>
  </div>;
}

export function CustomersRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useCustomerOverviewQuery(recordId);
  if (query.isPending) return <p className="py-10 text-sm text-muted-foreground">Loading customer profile…</p>;
  if (query.isError || !query.data) return <p role="alert" className="py-10 text-sm text-destructive">Could not load this customer profile.</p>;

  const { customer, merchant, addresses, paymentMethods, orders, payments, disputes } = query.data;
  const fullName = `${value(customer, "firstName")} ${value(customer, "lastName")}`;
  const lifetimeValue = payments.reduce((total, payment) => total + (typeof payment.amountMinor === "number" ? payment.amountMinor : 0), 0);
  return <div className="space-y-6">
    <div><p className="mb-2 text-sm text-muted-foreground"><Link to="/customers" className="hover:text-indigo-300">Customers</Link><span className="mx-2">/</span>Profile</p><div className="flex flex-wrap items-start justify-between gap-3"><div><h1 className="text-2xl font-semibold tracking-tight">{fullName}</h1><p className="mt-1 text-sm text-muted-foreground">{value(customer, "email")}{merchant ? ` · ${value(merchant, "name")}` : ""}</p></div><StatusBadge value={customer.status} /></div></div>
    <section className="grid gap-4 sm:grid-cols-3"><Card className="rounded-lg shadow-none"><CardContent className="flex items-center gap-3 p-5"><ShoppingBag className="size-5 text-indigo-400" /><div><p className="text-xs text-muted-foreground">Orders</p><p className="text-xl font-semibold">{orders.length}</p></div></CardContent></Card><Card className="rounded-lg shadow-none"><CardContent className="flex items-center gap-3 p-5"><Wallet className="size-5 text-indigo-400" /><div><p className="text-xs text-muted-foreground">Lifetime payments</p><p className="text-xl font-semibold tabular-nums">{money(lifetimeValue)}</p></div></CardContent></Card><Card className="rounded-lg shadow-none"><CardContent className="p-5"><p className="text-xs text-muted-foreground">Disputes</p><p className="text-xl font-semibold">{disputes.length}</p></CardContent></Card></section>
    <Card className="rounded-lg shadow-none"><CardHeader className="border-b pb-4"><CardTitle>Purchase history</CardTitle><CardDescription>Orders, items, and payment totals for this customer.</CardDescription></CardHeader><CardContent className="p-0">{orders.length === 0 ? <p className="p-5 text-sm text-muted-foreground">No purchases found.</p> : <Table><TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Date</TableHead><TableHead>Items</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader><TableBody>{orders.map((order) => <TableRow key={order.id}><TableCell><Link className="font-medium text-indigo-300 hover:underline" to={`/orders/${encodeURIComponent(order.id)}`}>{value(order, "externalId", order.id)}</Link></TableCell><TableCell>{date(order.placedAt)}</TableCell><TableCell>{order.items.length} · {order.items.map((item) => value(item, "productName")).slice(0, 2).join(", ")}</TableCell><TableCell><StatusBadge value={order.status} /></TableCell><TableCell className="text-right tabular-nums">{money(order.totalMinor, order.currency)}</TableCell></TableRow>)}</TableBody></Table>}</CardContent></Card>
    <div className="grid gap-4 lg:grid-cols-2"><Card className="rounded-lg shadow-none"><CardHeader className="border-b pb-4"><CardTitle className="flex items-center gap-2"><MapPin className="size-4 text-indigo-400" />Addresses</CardTitle><CardDescription>Saved billing and delivery addresses.</CardDescription></CardHeader><CardContent className="grid gap-3 pt-4 sm:grid-cols-2">{addresses.length === 0 ? <p className="text-sm text-muted-foreground">No saved addresses.</p> : addresses.map((address) => <div key={address.id} className="rounded-md border p-3 text-sm"><p className="font-medium">{value(address, "recipientName")}</p><p className="mt-1 text-muted-foreground">{value(address, "addressLine1")}{address.addressLine2 ? `, ${String(address.addressLine2)}` : ""}</p><p className="text-muted-foreground">{value(address, "city")}, {value(address, "state")} {value(address, "postalCode")}</p><p className="text-muted-foreground">{value(address, "country")}</p></div>)}</CardContent></Card><Card className="rounded-lg shadow-none"><CardHeader className="border-b pb-4"><CardTitle className="flex items-center gap-2"><Wallet className="size-4 text-indigo-400" />Payment methods</CardTitle><CardDescription>Payment methods used by this customer.</CardDescription></CardHeader><CardContent className="space-y-2 pt-4">{paymentMethods.length === 0 ? <p className="text-sm text-muted-foreground">No saved payment methods.</p> : paymentMethods.map((method) => <div key={method.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"><span>{value(method, "network", value(method, "type"))} {method.lastFour ? `ending in ${String(method.lastFour)}` : ""}</span><span className="text-xs text-muted-foreground">{value(method, "type")}</span></div>)}</CardContent></Card></div>
  </div>;
}
