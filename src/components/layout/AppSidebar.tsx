import {
  LayoutDashboard, Building2, Radar, GitBranch, Layers,
  BookOpen, Bot, Settings, ChevronLeft,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Funding Profile", url: "/funding-profile", icon: Building2 },
  { title: "Opportunities", url: "/opportunities", icon: Radar },
  { title: "Workflows", url: "/workflows", icon: GitBranch },
  { title: "Pipeline", url: "/pipeline", icon: Layers },
  { title: "Knowledge Vault", url: "/knowledge-vault", icon: BookOpen },
  { title: "Agent Activity", url: "/agent-activity", icon: Bot },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <div className="flex h-12 items-center px-4 border-b border-sidebar-border">
        {!collapsed ? (
          <span className="font-bold text-foreground tracking-[-0.03em] text-[15px]">INK</span>
        ) : (
          <span className="font-bold text-foreground tracking-[-0.03em] text-[15px] mx-auto">I</span>
        )}
      </div>

      <SidebarContent className="pt-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="flex items-center gap-3 px-3 py-[7px] rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-100"
                      activeClassName="text-foreground bg-secondary font-medium"
                    >
                      <item.icon className="h-[15px] w-[15px] shrink-0" strokeWidth={1.8} />
                      {!collapsed && <span className="text-[13px]">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-full py-1 rounded-md text-muted-foreground hover:text-foreground transition-colors duration-100"
        >
          <ChevronLeft className={`h-3.5 w-3.5 transition-transform duration-150 ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
