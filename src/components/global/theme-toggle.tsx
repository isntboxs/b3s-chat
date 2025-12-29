import { useTheme } from "@/components/providers/theme-provider";
import { Button } from "../ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ComputerIcon,
  MoonSlowWindIcon,
  Sun02Icon,
} from "@hugeicons/core-free-icons";

export function ThemeModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex items-center justify-between">
      <p>Theme</p>

      <div className="bg-background rounded-md border">
        <Button
          type="button"
          variant={theme === "light" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => setTheme("light")}
        >
          <HugeiconsIcon icon={Sun02Icon} />
        </Button>

        <Button
          type="button"
          variant={theme === "system" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => setTheme("system")}
        >
          <HugeiconsIcon icon={ComputerIcon} />
        </Button>

        <Button
          type="button"
          variant={theme === "dark" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => setTheme("dark")}
        >
          <HugeiconsIcon icon={MoonSlowWindIcon} />
        </Button>
      </div>
    </div>
  );
}
