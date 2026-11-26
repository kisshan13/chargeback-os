import type { AnchorHTMLAttributes } from "react";
import { cn } from "cn";

export type CustomWordmarkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export function CustomWordmark({ className, ...props }: CustomWordmarkProps) {
  return <a className={cn("custom-wordmark", className)} {...props} />;
}
