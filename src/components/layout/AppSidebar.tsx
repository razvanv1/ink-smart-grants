import {
  LayoutDashboard,
  Building2,
  Radar,
  GitBranch,
  Layers,
  BookOpen,
  Bot,
  Settings,
  ChevronLeft,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
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
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <div className="flex h-14 items-center gap-2 px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm tracking-tight">I</span>
            </div>
            <span className="font-semibold text-foreground tracking-tight text-[15px]">INK</span>
          </div>
        )}
        {collapsed && (
          <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center mx-auto">
            <span className="text-primary-foreground font-bold text-sm tracking-tight">I</span>
          </div>
        )}
      </div>

      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-150"
                      activeClassName="bg-sidebar-accent text-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
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
          className="flex items-center justify-center w-full py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors duration-150"
        >
          <ChevronLeft className={`h-4 w-4 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
