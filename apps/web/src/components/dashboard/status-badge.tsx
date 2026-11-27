import { Badge } from "@/components/ui/badge";

const goodStatuses = new Set(["ACTIVE", "CAPTURED", "SUCCEEDED", "DELIVERED", "COMPLETED", "WON", "ACCEPTED", "RESOLVED"]);
const attentionStatuses = new Set(["NEEDS_RESPONSE", "UNDER_REVIEW", "PENDING", "PROCESSING", "IN_TRANSIT", "AUTHORIZED", "REQUESTED"]);
const badStatuses = new Set(["FAILED", "LOST", "SUSPENDED", "CANCELED", "CLOSED", "RETURNED", "EXPIRED"]);

function humanize(value: string) {
  return value.toLowerCase().replaceAll("_", " ").replace(/^./, (letter) => letter.toUpperCase());
}

export function StatusBadge({ value }: { value: unknown }) {
  const status = typeof value === "string" ? value.toUpperCase() : "UNKNOWN";
  const tone = goodStatuses.has(status)
    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
    : attentionStatuses.has(status)
      ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
      : badStatuses.has(status)
        ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
        : "border-border bg-muted text-muted-foreground";

  return <Badge variant="outline" className={`font-medium ${tone}`}>{humanize(status)}</Badge>;
}
