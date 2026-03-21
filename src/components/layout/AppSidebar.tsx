import {
  LayoutDashboard, Building2, Radar, GitBranch, Layers,
  BookOpen, Bot, Settings, PanelLeftClose, PanelLeft,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
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
      {/* Brand mark */}
      <div className="flex h-14 items-center px-4 border-b border-sidebar-border">
        {!collapsed ? (
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 bg-primary rounded-sm flex items-center justify-center">
              <span className="text-[11px] font-extrabold text-primary-foreground tracking-tighter">IN</span>
            </div>
            <span className="font-extrabold text-foreground tracking-[-0.04em] text-[15px]">INK</span>
          </div>
        ) : (
          <div className="h-6 w-6 bg-primary rounded-sm flex items-center justify-center mx-auto">
            <span className="text-[11px] font-extrabold text-primary-foreground tracking-tighter">IN</span>
          </div>
        )}
      </div>

      <SidebarContent className="pt-4 px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="flex items-center gap-3 px-2.5 py-[7px] rounded text-muted-foreground hover:text-foreground transition-colors duration-100"
                      activeClassName="text-foreground font-semibold"
                    >
                      <item.icon className="h-[14px] w-[14px] shrink-0" strokeWidth={1.6} />
                      {!collapsed && <span className="text-[13px]">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-full py-1.5 text-muted-foreground hover:text-foreground transition-colors duration-100"
        >
          {collapsed ? <PanelLeft className="h-3.5 w-3.5" /> : <PanelLeftClose className="h-3.5 w-3.5" />}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
