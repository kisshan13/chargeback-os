import { Outlet } from "react-router-dom";
import { QueryProvider } from "@/query-provider";
import "../styles.css";

export function RootLayout() {
  return (
    <QueryProvider>
      <Outlet />
    </QueryProvider>
  );
}
