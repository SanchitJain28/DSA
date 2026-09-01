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
import {
  SquareTerminal,
  BetweenHorizontalEnd,
  Link as LinkIcon,
  Network,
  ListOrdered,
  Search,
  ArrowLeft,
  Layers,
  TreePine,
} from "lucide-react";
import { TOPIC_GROUPS, PROBLEMS } from "@/data/problems";
import type { VisualizerType } from "@/types/visualizer";

const TOPIC_ICONS: Record<string, React.ElementType> = {
  arrays: SquareTerminal,
  "binary-search": Search,
  stack: Layers,
  "sliding-window": BetweenHorizontalEnd,
  "linked-list": LinkIcon,
  recursion: ListOrdered,
  trees: Network,
  heap: Layers,
};

export function AppSidebar({
  activeTab,
  setActiveTab,
}: {
  activeTab: VisualizerType;
  setActiveTab: (tab: VisualizerType) => void;
}) {
  const {
    showPointers,
    setShowPointers,
    randomizePointerColors,
    setRandomizePointerColors,
  } = useSettings();

  return (
    <Sidebar
      side="left"
      variant="sidebar"
      className="bg-[#111217] border-r border-[#24252d] font-['Poppins',sans-serif]"
    >
      {/* Sidebar Top Header */}
      <SidebarHeader className="border-b border-[#24252d] h-[60px] px-3.5 flex flex-row items-center justify-between bg-[#111217]">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-[12px] font-medium text-[#f2f2f5] bg-gradient-to-b from-[#33333a] to-[#26262c] border border-[#3d3d45] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_1px_2px_rgba(0,0,0,0.4)] px-2.5 py-1 rounded-[7px] hover:from-[#3a3a42] hover:to-[#2c2c33] transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <div className="flex items-center gap-2">
          <img
            src="/tracedsa.png"
            alt="Trace DSA Logo"
            className="w-5 h-5 rounded object-contain"
          />
          <span className="font-semibold text-[13px] text-[#ededf0] tracking-[-0.01em]">
            Trace<span className="text-[#c9c3b6]">DSA</span>
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="scrollbar-none">
        {/* Settings Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="p-3 flex items-center justify-between text-xs text-[#ededf0]">
                <span>Show Pointers</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={showPointers}
                    onChange={(e) => setShowPointers(e.target.checked)}
                  />
                  <div className="w-10 h-5 bg-[#212126] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#c9c3b6]"></div>
                </label>
              </SidebarMenuItem>
              <SidebarMenuItem className="p-3 flex items-center justify-between border-t border-[#24252d] text-xs text-[#ededf0]">
                <span>Randomize Colors</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={randomizePointerColors}
                    onChange={(e) =>
                      setRandomizePointerColors(e.target.checked)
                    }
                    disabled={!showPointers}
                  />
                  <div
                    className={`w-10 h-5 bg-[#212126] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all ${
                      showPointers
                        ? "peer-checked:bg-[#c9c3b6]"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                  ></div>
                </label>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {TOPIC_GROUPS.map((group) => {
          const Icon = TOPIC_ICONS[group.id] || SquareTerminal;
          const groupProblems = PROBLEMS.filter((p) => p.topicId === group.id);

          return (
            <SidebarGroup key={group.id}>
              <SidebarGroupLabel>{group.name}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.id === "trees" && (
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeTab === "treevisualizer"}
                        onClick={() => setActiveTab("treevisualizer")}
                        className="cursor-pointer"
                      >
                        <TreePine className="w-4 h-4 mr-2 text-[#c9c3b6]" />
                        <span className="font-semibold text-[#c9c3b6]">
                          Tree Visualizer (Playground)
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}

                  {groupProblems.map((prob) => (
                    <SidebarMenuItem key={prob.id}>
                      <SidebarMenuButton
                        isActive={activeTab === prob.id}
                        onClick={() => setActiveTab(prob.id)}
                        className="cursor-pointer"
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        <span>{prob.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
