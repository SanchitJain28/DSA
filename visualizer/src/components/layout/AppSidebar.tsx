import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSettings } from "@/contexts/SettingsContext";
import { Link } from "react-router-dom";
import { SquareTerminal, BetweenHorizontalEnd } from "lucide-react";

export function AppSidebar({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}) {
  const { showPointers, setShowPointers } = useSettings();

  return (
    <Sidebar side="left" variant="sidebar">
      <SidebarHeader className="border-b border-sidebar-border h-[60px] flex items-center justify-center">
        <h2 className="text-lg font-bold">Settings</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Visualizations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="p-4 flex items-center justify-between">
                <span className="text-sm font-medium">Show Pointers</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={showPointers}
                    onChange={(e) => setShowPointers(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Stacks</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "asteroidcollision"}
                  onClick={() => setActiveTab("asteroidcollision")}
                >
                  <SquareTerminal className="w-4 h-4 mr-2" />
                  <span>Asteroid Collision</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "carfleet"}
                  onClick={() => setActiveTab("carfleet")}
                >
                  <SquareTerminal className="w-4 h-4 mr-2" />
                  <span>Car Fleet</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Sliding Window</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "longestcharreplacement"}
                  onClick={() => setActiveTab("longestcharreplacement")}
                >
                  <BetweenHorizontalEnd className="w-4 h-4 mr-2" />
                  <span>Longest Char Replacement</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="p-4">
                <Link
                  to="/revision"
                  className="text-sm font-medium text-blue-500 hover:underline"
                >
                  Go to Revision Tracker
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
