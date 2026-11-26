export function cn(...values: unknown[]): string {
  return values
    .flatMap((value) => {
      if (typeof value === "string" || typeof value === "number") {
        return String(value);
      }

      if (Array.isArray(value)) {
        return cn(...value);
      }

      if (value && typeof value === "object") {
        return Object.entries(value)
          .filter(([, enabled]) => Boolean(enabled))
          .map(([className]) => className)
          .join(" ");
      }

      return "";
    })
    .filter(Boolean)
    .join(" ");
}
