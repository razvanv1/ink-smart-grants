import { Search, Bell, ChevronDown } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeader() {
  return (
    <header className="h-12 flex items-center justify-between px-5 border-b border-border">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <div className="hidden md:flex items-center gap-1.5 text-[13px] text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
          <span className="font-medium text-foreground">The Unlearning School</span>
          <ChevronDown className="h-3 w-3" />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <Search className="h-3.5 w-3.5" />
          <span>Search</span>
          <kbd className="hidden lg:inline text-[10px] px-1 py-0.5 rounded border border-border text-muted-foreground font-mono">⌘K</kbd>
        </button>
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>
        <button className="ml-1 h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-[11px] font-semibold text-foreground">
          E
        </button>
      </div>
    </header>
  );
}
