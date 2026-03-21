import { Search, Bell, ChevronDown } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeader() {
  return (
    <header className="h-12 flex items-center justify-between px-6 border-b border-border">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground -ml-1" />
        <div className="hidden md:flex items-center gap-1 cursor-pointer group">
          <span className="text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors">The Unlearning School</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </div>
      </div>

      <div className="flex items-center gap-0.5">
        <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors rounded hover:bg-secondary">
          <Search className="h-3.5 w-3.5" />
          <span>Search</span>
          <kbd className="hidden lg:inline text-[10px] px-1.5 py-0.5 rounded border border-border text-muted-foreground/60 font-mono ml-2">⌘K</kbd>
        </button>
        <button className="relative p-2.5 text-muted-foreground hover:text-foreground transition-colors rounded hover:bg-secondary">
          <Bell className="h-[15px] w-[15px]" strokeWidth={1.6} />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>
        <div className="ml-2 h-7 w-7 rounded-sm bg-foreground flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
          <span className="text-[11px] font-bold text-background">EP</span>
        </div>
      </div>
    </header>
  );
}
