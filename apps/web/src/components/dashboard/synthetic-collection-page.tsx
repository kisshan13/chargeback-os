import { useMemo, useState } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { SyntheticCollectionResponse, SyntheticRecord, SyntheticRecordResponse } from "@/core-api/types";

type CollectionQuery = UseQueryResult<SyntheticCollectionResponse, Error>;
type RecordQuery = UseQueryResult<SyntheticRecordResponse, Error>;

function label(value: string) {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/^./, (letter) => letter.toUpperCase());
}

function valueText(value: unknown) {
  if (value === null || value === undefined) return "—";
  return typeof value === "object" ? JSON.stringify(value) : String(value);
}

export function SyntheticCollectionPage({
  title,
  path,
  query,
  offset,
  onOffsetChange
}: {
  title: string;
  path: string;
  query: CollectionQuery;
  offset: number;
  onOffsetChange: (offset: number) => void;
}) {
  const [search, setSearch] = useState("");
  const records = query.data?.items ?? [];
  const visibleRecords = useMemo(() => records.filter((record) => JSON.stringify(record).toLowerCase().includes(search.toLowerCase())), [records, search]);
  const columns = records[0] ? ["id", ...Object.keys(records[0]).filter((key) => key !== "id").slice(0, 4)] : [];
  const total = query.data?.total ?? 0;

  return (
    <div className="space-y-6">
      <div><div className="mb-2 text-sm text-muted-foreground"><Link to="/dashboard" className="hover:text-indigo-300">Overview</Link><span className="mx-2">/</span>{title}</div><h1 className="text-2xl font-semibold tracking-tight">{title}</h1><p className="mt-1 text-sm text-muted-foreground">Browse the synthetic {title.toLowerCase()} dataset.</p></div>
      <Card className="rounded-lg shadow-none">
        <CardHeader className="flex flex-row flex-wrap items-end justify-between gap-3 border-b pb-4">
          <div><CardTitle>{title} records</CardTitle><CardDescription className="mt-1">{total.toLocaleString()} records in this collection.</CardDescription></div>
          <Input aria-label={`Search ${title}`} placeholder="Search this page" value={search} onChange={(event) => setSearch(event.target.value)} className="h-9 w-full sm:w-64" />
        </CardHeader>
        {query.isPending && <CardContent className="py-8 text-sm text-muted-foreground">Loading records…</CardContent>}
        {query.isError && <CardContent role="alert" className="py-8 text-sm text-destructive">Could not load {title.toLowerCase()}.</CardContent>}
        {!query.isPending && !query.isError && visibleRecords.length === 0 && <CardContent className="py-8 text-sm text-muted-foreground">No records found.</CardContent>}
        {visibleRecords.length > 0 && <CardContent className="p-0"><Table>
          <TableHeader><TableRow>{columns.map((column) => <TableHead key={column}>{label(column)}</TableHead>)}<TableHead className="w-20 text-right">View</TableHead></TableRow></TableHeader>
          <TableBody>{visibleRecords.map((record, index) => {
            const id = typeof record.id === "string" ? record.id : String(offset + index);
            return <TableRow key={id}>{columns.map((column) => <TableCell key={column} className="max-w-64 truncate" title={valueText(record[column])}>{valueText(record[column])}</TableCell>)}<TableCell className="text-right"><Button variant="link" size="sm" render={<Link to={`/${path}/${encodeURIComponent(id)}`} />}>View</Button></TableCell></TableRow>;
          })}</TableBody>
        </Table></CardContent>}
        <div className="flex items-center justify-between border-t px-5 py-3">
          <p className="text-xs text-muted-foreground">{total === 0 ? 0 : offset + 1}–{Math.min(offset + 50, total)} of {total}</p>
          <div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => onOffsetChange(Math.max(0, offset - 50))} disabled={offset === 0 || query.isPending}><ArrowLeft />Previous</Button><Button variant="outline" size="sm" onClick={() => onOffsetChange(offset + 50)} disabled={!query.data || offset + 50 >= total || query.isPending}>Next<ArrowRight /></Button></div>
        </div>
      </Card>
    </div>
  );
}

export function SyntheticRecordPage({ title, path, recordId, query }: { title: string; path: string; recordId: string; query: RecordQuery }) {
  return (
    <div className="space-y-6">
      <div><div className="mb-2 text-sm text-muted-foreground"><Link to={`/${path}`} className="hover:text-indigo-300">{title}</Link><span className="mx-2">/</span>Record</div><h1 className="text-2xl font-semibold tracking-tight">{title} record</h1><p className="mt-1 break-all text-sm text-muted-foreground">{recordId}</p></div>
      {query.isPending && <Card><CardContent className="py-8 text-sm text-muted-foreground">Loading record…</CardContent></Card>}
      {query.isError && <Card><CardContent role="alert" className="py-8 text-sm text-destructive">Could not load this record.</CardContent></Card>}
      {query.data && <Card className="rounded-lg shadow-none"><CardHeader className="border-b pb-4"><CardTitle>Record details</CardTitle><CardDescription>{title} fields from the synthetic dataset.</CardDescription></CardHeader><CardContent className="grid gap-x-8 sm:grid-cols-2">{Object.entries(query.data.record as SyntheticRecord).map(([key, value]) => <div key={key} className="border-b py-4"><p className="text-xs text-muted-foreground">{label(key)}</p><p className="mt-1 break-words text-sm">{valueText(value)}</p></div>)}</CardContent></Card>}
    </div>
  );
}
