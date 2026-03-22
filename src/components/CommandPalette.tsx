import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Radar, GitBranch, BookOpen, LayoutDashboard, Layers, Bot, Building2, Settings } from "lucide-react";
import { useOpportunities } from "@/hooks/useOpportunities";

const pages = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Funding Profile", path: "/funding-profile", icon: Building2 },
  { name: "Opportunities", path: "/opportunities", icon: Radar },
  { name: "Workflows", path: "/workflows", icon: GitBranch },
  { name: "Pipeline", path: "/pipeline", icon: Layers },
  { name: "Knowledge Vault", path: "/knowledge-vault", icon: BookOpen },
  { name: "Agent Activity", path: "/agent-activity", icon: Bot },
  { name: "Settings", path: "/settings", icon: Settings },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { data: opportunities = [] } = useOpportunities();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages, opportunities…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>

        <CommandGroup heading="Pages">
          {pages.map((p) => (
            <CommandItem key={p.path} onSelect={() => go(p.path)}>
              <p.icon className="mr-2 h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.6} />
              {p.name}
            </CommandItem>
          ))}
        </CommandGroup>

        {opportunities.length > 0 && (
          <CommandGroup heading="Opportunities">
            {opportunities.map((o) => (
              <CommandItem key={o.id} onSelect={() => go(`/opportunities/${o.id}`)}>
                <Radar className="mr-2 h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.6} />
                <span className="truncate">{o.call_name}</span>
                <span className="ml-auto text-[11px] text-muted-foreground">{o.programme}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
