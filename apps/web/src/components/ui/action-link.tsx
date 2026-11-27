import type { AnchorHTMLAttributes } from "react";

export interface ActionLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "primary" | "secondary";
  compact?: boolean;
}

export function ActionLink({
  variant = "secondary",
  compact = false,
  className = "",
  ...props
}: ActionLinkProps) {
  const variantClasses =
    variant === "primary"
      ? "bg-indigo-500 !text-white hover:bg-indigo-400 hover:!text-white"
      : "text-zinc-200 hover:text-white";
  const sizeClasses = compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-xs";

  return (
    <a
      className={`inline-flex items-center justify-center gap-2 font-mono font-medium no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-400 ${sizeClasses} ${variantClasses} ${className}`.trim()}
      {...props}
    />
  );
}
