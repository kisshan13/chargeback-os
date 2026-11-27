import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, MapPin, PackageCheck, UserRound } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { SyntheticRecord } from "@/core-api/types";
import { useOrdersQuery, useOrderOverviewQuery } from "@/hooks/query/use-orders-query";

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

function statusLabel(status: string) {
  return status.toLowerCase().replaceAll("_", " ");
}

export function OrdersPage() {
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const query = useOrdersQuery(50, offset);
  const orders = (query.data?.items ?? []).filter((order) =>
    `${order.externalId ?? ""} ${order.customerName ?? ""}`.toLowerCase().includes(search.toLowerCase()),
  );
  const total = query.data?.total ?? 0;

  return <div className="space-y-6">
    <div><h1 className="text-2xl font-semibold tracking-tight">Orders</h1><p className="mt-1 text-sm text-muted-foreground">Orders with customer, product, and fulfillment details together.</p></div>
    <Card className="rounded-lg shadow-none"><CardHeader className="flex flex-row flex-wrap items-end justify-between gap-3 border-b pb-4"><div><CardTitle>Order history</CardTitle><CardDescription>{total.toLocaleString()} orders</CardDescription></div><Input aria-label="Search orders" placeholder="Search order or customer" value={search} onChange={(event) => setSearch(event.target.value)} className="h-9 w-full sm:w-64" /></CardHeader>
      {query.isPending && <CardContent className="py-10 text-sm text-muted-foreground">Loading orders…</CardContent>}
      {query.isError && <CardContent role="alert" className="py-10 text-sm text-destructive">Could not load orders.</CardContent>}
      {!query.isPending && !query.isError && orders.length === 0 && <CardContent className="py-10 text-sm text-muted-foreground">No orders match this search.</CardContent>}
      {orders.length > 0 && <CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Customer</TableHead><TableHead>Placed</TableHead><TableHead>Items</TableHead><TableHead>Fulfillment</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader><TableBody>{orders.map((order) => <TableRow key={order.id}><TableCell><Link className="font-medium text-indigo-300 hover:underline" to={`/orders/${encodeURIComponent(order.id)}`}>{String(order.externalId ?? order.id)}</Link></TableCell><TableCell>{String(order.customerName ?? "Unknown customer")}</TableCell><TableCell>{date(order.placedAt)}</TableCell><TableCell>{String(order.itemCount ?? 0)}</TableCell><TableCell><StatusBadge value={order.fulfillmentStatus} /></TableCell><TableCell className="text-right tabular-nums">{money(order.totalMinor, order.currency)}</TableCell></TableRow>)}</TableBody></Table></CardContent>}
      <div className="flex items-center justify-between border-t px-5 py-3"><p className="text-xs text-muted-foreground">{total === 0 ? 0 : offset + 1}–{Math.min(offset + 50, total)} of {total}</p><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => setOffset(Math.max(offset - 50, 0))} disabled={!offset || query.isPending}><ArrowLeft />Previous</Button><Button variant="outline" size="sm" onClick={() => setOffset(offset + 50)} disabled={!query.data || offset + 50 >= total || query.isPending}>Next<ArrowRight /></Button></div></div>
    </Card>
  </div>;
}

export function OrdersRecordPage() {
  const { recordId = "" } = useParams<{ recordId: string }>();
  const query = useOrderOverviewQuery(recordId);
  if (query.isPending) return <p className="py-10 text-sm text-muted-foreground">Loading order details…</p>;
  if (query.isError || !query.data) return <p role="alert" className="py-10 text-sm text-destructive">Could not load this order.</p>;

  const { order, customer, merchant, billingAddress, shippingAddress, items, payments, shipments } = query.data;
  const fulfillment = shipments.some((shipment) => shipment.status === "DELIVERED")
    ? "Delivered"
    : shipments.some((shipment) => shipment.status === "IN_TRANSIT" || shipment.status === "SHIPPED")
      ? "In transit"
      : shipments[0] ? statusLabel(String(shipments[0].status)) : "Not shipped";
  return <div className="space-y-6">
    <div><p className="mb-2 text-sm text-muted-foreground"><Link to="/orders" className="hover:text-indigo-300">Orders</Link><span className="mx-2">/</span>Order details</p><div className="flex flex-wrap items-start justify-between gap-3"><div><h1 className="text-2xl font-semibold tracking-tight">{value(order, "externalId", order.id)}</h1><p className="mt-1 text-sm text-muted-foreground">Placed {date(order.placedAt)}{merchant ? ` · ${value(merchant, "name")}` : ""}</p></div><StatusBadge value={order.status} /></div></div>
    <section className="grid gap-4 sm:grid-cols-3"><Card className="rounded-lg shadow-none"><CardContent className="p-5"><p className="text-xs text-muted-foreground">Order total</p><p className="mt-1 text-xl font-semibold tabular-nums">{money(order.totalMinor, order.currency)}</p></CardContent></Card><Card className="rounded-lg shadow-none"><CardContent className="p-5"><p className="text-xs text-muted-foreground">Items</p><p className="mt-1 text-xl font-semibold">{items.reduce((sum, item) => sum + (typeof item.quantity === "number" ? item.quantity : 0), 0)} units · {items.length} products</p></CardContent></Card><Card className="rounded-lg shadow-none"><CardContent className="flex items-center gap-3 p-5"><PackageCheck className="size-5 text-indigo-400" /><div><p className="text-xs text-muted-foreground">Fulfillment</p><p className="mt-1 text-base font-semibold capitalize">{fulfillment}</p></div></CardContent></Card></section>
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]"><Card className="rounded-lg shadow-none"><CardHeader className="border-b pb-4"><CardTitle>What’s in this order</CardTitle><CardDescription>Products, quantities, and line totals.</CardDescription></CardHeader><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Quantity</TableHead><TableHead className="text-right">Unit price</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader><TableBody>{items.map((item) => <TableRow key={item.id}><TableCell><p className="font-medium">{item.product ? <Link className="text-indigo-300 hover:underline" to={`/products/${encodeURIComponent(item.product.id)}`}>{value(item.product, "name")}</Link> : value(item, "productName")}</p><p className="mt-0.5 max-w-md truncate text-xs text-muted-foreground">{item.product ? value(item.product, "description", "") : value(item, "productDescription", "")}</p></TableCell><TableCell>{value(item, "quantity")}</TableCell><TableCell className="text-right tabular-nums">{money(item.unitPriceMinor, item.currency)}</TableCell><TableCell className="text-right tabular-nums">{money(item.totalMinor, item.currency)}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
      <Card className="rounded-lg shadow-none"><CardHeader className="border-b pb-4"><CardTitle className="flex items-center gap-2"><UserRound className="size-4 text-indigo-400" />Customer</CardTitle></CardHeader><CardContent className="pt-4">{customer ? <><Link to={`/customers/${encodeURIComponent(customer.id)}`} className="font-medium text-indigo-300 hover:underline">{value(customer, "firstName")} {value(customer, "lastName")}</Link><p className="mt-1 text-sm text-muted-foreground">{value(customer, "email")}</p><p className="text-sm text-muted-foreground">{value(customer, "phone", "No phone on file")}</p></> : <p className="text-sm text-muted-foreground">Customer information unavailable.</p>}</CardContent></Card></div>
    <div className="grid gap-4 lg:grid-cols-2"><Card className="rounded-lg shadow-none"><CardHeader className="border-b pb-4"><CardTitle className="flex items-center gap-2"><MapPin className="size-4 text-indigo-400" />Delivery</CardTitle><CardDescription>Shipping address and latest tracking activity.</CardDescription></CardHeader><CardContent className="space-y-4 pt-4">{shippingAddress ? <div className="text-sm"><p className="font-medium">{value(shippingAddress, "recipientName")}</p><p className="text-muted-foreground">{value(shippingAddress, "addressLine1")}{shippingAddress.addressLine2 ? `, ${String(shippingAddress.addressLine2)}` : ""}</p><p className="text-muted-foreground">{value(shippingAddress, "city")}, {value(shippingAddress, "state")} {value(shippingAddress, "postalCode")}, {value(shippingAddress, "country")}</p></div> : <p className="text-sm text-muted-foreground">No shipping address is recorded.</p>}{shipments.map((shipment) => <div key={shipment.id} className="border-t pt-3"><div className="flex flex-wrap justify-between gap-2 text-sm"><span className="font-medium">{value(shipment, "carrier")} · {value(shipment, "trackingNumber")}</span><StatusBadge value={shipment.status} /></div><ol className="mt-2 space-y-2">{shipment.events.slice(0, 4).map((event) => <li key={event.id} className="flex justify-between gap-3 text-xs"><span>{value(event, "description", statusLabel(value(event, "type")))}</span><span className="shrink-0 text-muted-foreground">{date(event.occurredAt)}</span></li>)}</ol></div>)}</CardContent></Card>
      <Card className="rounded-lg shadow-none"><CardHeader className="border-b pb-4"><CardTitle>Payment & address</CardTitle><CardDescription>Charges and billing details for this order.</CardDescription></CardHeader><CardContent className="space-y-4 pt-4">{payments.length === 0 ? <p className="text-sm text-muted-foreground">No payment recorded.</p> : payments.map((payment) => <div key={payment.id} className="flex items-center justify-between gap-3 text-sm"><span><span className="font-medium">{money(payment.amountMinor, payment.currency)}</span><span className="ml-2 text-muted-foreground">{value(payment, "status").toLowerCase()}</span></span><span className="text-xs text-muted-foreground">{date(payment.createdAt)}</span></div>)}{billingAddress && <div className="border-t pt-3 text-sm"><p className="font-medium">Billing address</p><p className="mt-1 text-muted-foreground">{value(billingAddress, "addressLine1")}, {value(billingAddress, "city")}, {value(billingAddress, "country")}</p></div>}</CardContent></Card></div>
  </div>;
}
