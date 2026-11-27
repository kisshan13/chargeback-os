import { Outlet, useLocation } from "react-router-dom";
import type { CSSProperties } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { API_URL } from "@/config/constants";
import { collectionLabel, collectionSlug, syntheticDataGroups } from "@/components/dashboard/data-groups";

const sidebarTheme = {
  "--sidebar-primary": "#6366f1",
  "--sidebar-accent": "#383a40",
  "--sidebar-accent-foreground": "#f2f3f5"
} as CSSProperties;

export function DashboardLayout() {
  const { pathname } = useLocation();
  const path = pathname.split("/").filter(Boolean)[0];
  const collection = syntheticDataGroups.flatMap((group) => group.collections).find((name) => collectionSlug(name) === path);
  const title = path === "policies" ? "Policies & reasons" : collection ? collectionLabel(collection) : "Chargeback overview";

  return (
    <div style={sidebarTheme}>
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbPage>{title}</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <a className="ml-auto text-sm text-indigo-400 hover:text-indigo-300" href={`${API_URL}/openapi.json`} target="_blank" rel="noreferrer">API schema</a>
          </header>
          <div className="flex-1 space-y-6 p-4 md:p-8">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
