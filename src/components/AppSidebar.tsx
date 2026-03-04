import { Activity, Info } from "lucide-react";
import { MACHINE_CONFIGS } from "@/types/measurement";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Logo from "@/assets/logo.jpg";

interface AppSidebarProps {
  activeMachine: string;
  onMachineChange: (id: string) => void;
  activeView: string;
  onViewChange: (view: string) => void;
}

export function AppSidebar({
  activeMachine,
  onMachineChange,
  activeView,
  onViewChange,
}: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          {!collapsed && (
            <div className="min-w-0">
              <img
                src={Logo}
                alt="Logo"
              />
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-base mb-2">Máy đo</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="text-sm">
              {MACHINE_CONFIGS.map((m) => (
                <SidebarMenuItem key={m.id}>
                  <SidebarMenuButton
                    isActive={activeMachine === m.id}
                    tooltip={m.name}
                    onClick={() => {
                      onViewChange("machine");
                      onMachineChange(m.id);
                    }}
                  >
                    <Activity className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>{m.name}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={activeView === "about"}
              tooltip="About Us"
              onClick={() => onViewChange("about")}
            >
              <Info className="h-4 w-4 shrink-0" />
              {!collapsed && <span>About Us</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
