import { Search, Bell, ChevronDown, LogOut } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppHeader() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const orgId = useOrganizationId();
  const { data: orgName } = useQuery({
    queryKey: ['org-name', orgId],
    queryFn: async () => {
      if (!orgId) return null;
      const { data } = await supabase.from('organizations').select('name').eq('id', orgId).single();
      return data?.name ?? null;
    },
    enabled: !!orgId,
    staleTime: 1000 * 60 * 5,
  });

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "??";

  const openCommandPalette = () => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <header className="h-12 flex items-center justify-between px-6 border-b border-border">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground -ml-1" />
        <div className="hidden md:flex items-center gap-1 cursor-pointer group">
          <span className="text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors">{orgName || 'My Organization'}</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </div>
      </div>

      <div className="flex items-center gap-0.5">
        <button
          onClick={openCommandPalette}
          className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-all rounded-full hover:bg-secondary active:scale-[0.96]"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search</span>
          <kbd className="hidden lg:inline text-[10px] px-1.5 py-0.5 rounded-full border border-border text-muted-foreground/60 font-mono ml-2">⌘K</kbd>
        </button>
        <button className="relative p-2.5 text-muted-foreground hover:text-foreground transition-all rounded-full hover:bg-secondary active:scale-[0.96]">
          <Bell className="h-[15px] w-[15px]" strokeWidth={1.6} />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="ml-2 h-7 w-7 rounded-full bg-foreground flex items-center justify-center cursor-pointer hover:opacity-80 transition-all hover:shadow-md hover:shadow-foreground/15 active:scale-[0.96]">
              <span className="text-[11px] font-bold text-background">{initials}</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="text-[12px] text-muted-foreground" disabled>
              {user?.email}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut} className="text-[12px]">
              <LogOut className="mr-2 h-3.5 w-3.5" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
