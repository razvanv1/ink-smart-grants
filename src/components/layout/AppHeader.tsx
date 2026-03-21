import { Search, Bell, ChevronDown, User } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeader() {
  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />

        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-secondary border border-border text-sm cursor-pointer hover:bg-muted transition-colors">
          <Building2Icon />
          <span className="text-foreground font-medium text-[13px]">The Unlearning School</span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary border border-border text-muted-foreground text-sm cursor-pointer hover:border-primary/30 transition-colors">
          <Search className="h-3.5 w-3.5" />
          <span className="text-[13px]">Search…</span>
          <kbd className="hidden lg:inline text-[11px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">⌘K</kbd>
        </div>

        <button className="relative p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>

        <button className="flex items-center gap-2 p-1.5 rounded-md hover:bg-secondary transition-colors">
          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </button>
      </div>
    </header>
  );
}

function Building2Icon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>
    </svg>
  );
}
