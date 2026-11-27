import { Link, useLocation } from "react-router-dom";
import { Activity, CreditCard, FileText, LayoutDashboard, PackageCheck, ShoppingBag, Users } from "lucide-react";
import { CustomWordmark } from "@/components/custom-ui";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

const navigation = [
  { label: "Overview", path: "/dashboard", icon: LayoutDashboard },
  { label: "Disputes", path: "/disputes", icon: Activity },
  { label: "Customers", path: "/customers", icon: Users },
  { label: "Orders", path: "/orders", icon: ShoppingBag },
  { label: "Payments", path: "/payments", icon: CreditCard },
  { label: "Products", path: "/products", icon: PackageCheck },
  { label: "Policies & reasons", path: "/policies", icon: FileText },
];

export function DashboardSidebar() {
  const { pathname } = useLocation();

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="h-14 justify-center border-b border-sidebar-border px-4"><CustomWordmark href="/" aria-label="Chargeback OS home" className="text-sm text-sidebar-foreground">chargeback os</CustomWordmark></SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarMenu>{navigation.map(({ label, path, icon: Icon }) => <SidebarMenuItem key={path}><SidebarMenuButton isActive={pathname === path || (path !== "/dashboard" && pathname.startsWith(`${path}/`))} render={<Link to={path} />}><Icon /><span>{label}</span></SidebarMenuButton></SidebarMenuItem>)}</SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border"><SidebarMenu><SidebarMenuItem><SidebarMenuButton render={<Link to="/" />}><span>Back to home</span></SidebarMenuButton></SidebarMenuItem></SidebarMenu></SidebarFooter>
    </Sidebar>
  );
}
