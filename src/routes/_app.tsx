import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  LeftNavHeader,
  RigthtNavHeader,
} from "@/features/sidebar/components/app-header";
import { AppSidebar } from "@/features/sidebar/components/app-sidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      className="relative"
    >
      <AppSidebar variant="inset" />

      <LeftNavHeader />
      <RigthtNavHeader />

      <SidebarInset>
        <div className="flex h-full w-full flex-1 flex-col">
          <div className="container mx-auto max-w-3xl h-full flex flex-1 flex-col gap-2">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
