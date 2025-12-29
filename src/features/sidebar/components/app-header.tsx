import { ThemeModeToggle } from "@/components/global/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  PanelLeft,
  PanelLeftClose,
  Search01Icon,
  Settings05Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Activity } from "react";

export const LeftNavHeader = () => {
  const { state, toggleSidebar, isMobile } = useSidebar();

  return (
    <nav
      className={cn(
        "top-0 z-50 flex items-center gap-2 px-4 pt-5 shrink-0 h-(--header-height)  transition-[width,height] ease-linear absolute pointer-events-auto",
        "group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)",
        isMobile && "px-2 pt-0"
      )}
    >
      <div
        className={cn(
          "transition-all ease-in-out p-1",
          (state === "collapsed" || isMobile) &&
            "bg-secondary/65 supports-backdrop-filter:bg-secondary/65 backdrop-blur-sm rounded-md"
        )}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          {state === "collapsed" || isMobile ? (
            <HugeiconsIcon icon={PanelLeft} />
          ) : (
            <HugeiconsIcon icon={PanelLeftClose} />
          )}
        </Button>

        <Activity
          mode={state === "collapsed" || isMobile ? "visible" : "hidden"}
        >
          <Button type="button" variant="ghost" size="icon">
            <HugeiconsIcon icon={Search01Icon} />
          </Button>
        </Activity>
      </div>
    </nav>
  );
};

export const RigthtNavHeader = () => {
  const { isMobile } = useSidebar();

  return (
    <nav
      className={cn(
        "top-0 right-0 z-50 flex items-center gap-2 px-4 pt-5 shrink-0 h-(--header-height)  transition-[width,height] ease-linear absolute pointer-events-auto",
        "group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)",
        isMobile && "px-2 pt-0"
      )}
    >
      <div className="bg-secondary/65 supports-backdrop-filter:bg-secondary/65 backdrop-blur-sm rounded-md p-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon">
              <HugeiconsIcon icon={Settings05Icon} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={10}
            className="w-(--radix-dropdown-menu-trigger-width) min-w-44 p-2"
          >
            <ThemeModeToggle />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};
