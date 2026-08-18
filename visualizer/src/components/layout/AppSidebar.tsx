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
} from "lucide-react";

export function AppSidebar({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}) {
  const {
    showPointers,
    setShowPointers,
    randomizePointerColors,
    setRandomizePointerColors,
  } = useSettings();

  return (
    <Sidebar side="left" variant="sidebar">
      <SidebarHeader className="border-b border-sidebar-border h-[60px] px-3 flex flex-row items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300 hover:text-white px-2 py-1 rounded bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <div className="flex items-center gap-1.5">
          <img
            src="/tracedsa.png"
            alt="Trace DSA Logo"
            className="w-5 h-5 rounded object-contain"
          />
          <span className="font-['JetBrains_Mono',monospace] text-xs font-bold text-neutral-200">
            Trace<span className="text-indigo-400">DSA</span>
          </span>
        </div>
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
              <SidebarMenuItem className="p-4 flex items-center justify-between border-t border-sidebar-border">
                <span className="text-sm font-medium">Randomize Colors</span>
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
                    className={`w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${showPointers ? "peer-checked:bg-blue-600" : "opacity-50 cursor-not-allowed"}`}
                  ></div>
                </label>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Trees</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "preorder"}
                  onClick={() => setActiveTab("preorder")}
                >
                  <Network className="w-4 h-4 mr-2" />
                  <span>Preorder Traversal</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "inorder"}
                  onClick={() => setActiveTab("inorder")}
                >
                  <Network className="w-4 h-4 mr-2" />
                  <span>Inorder Traversal</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "postorder"}
                  onClick={() => setActiveTab("postorder")}
                >
                  <Network className="w-4 h-4 mr-2" />
                  <span>Postorder Traversal</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "invert"}
                  onClick={() => setActiveTab("invert")}
                >
                  <Network className="w-4 h-4 mr-2" />
                  <span>Invert Binary Tree</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "maxdepth"}
                  onClick={() => setActiveTab("maxdepth")}
                >
                  <Network className="w-4 h-4 mr-2" />
                  <span>Max Depth</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "diameter"}
                  onClick={() => setActiveTab("diameter")}
                >
                  <Network className="w-4 h-4 mr-2" />
                  <span>Diameter</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "balanced"}
                  onClick={() => setActiveTab("balanced")}
                >
                  <Network className="w-4 h-4 mr-2" />
                  <span>Balanced Binary Tree</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "sametree"}
                  onClick={() => setActiveTab("sametree")}
                >
                  <Network className="w-4 h-4 mr-2" />
                  <span>Same Tree</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "subtree"}
                  onClick={() => setActiveTab("subtree")}
                >
                  <Network className="w-4 h-4 mr-2" />
                  <span>Subtree</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "symmetric"}
                  onClick={() => setActiveTab("symmetric")}
                >
                  <Network className="w-4 h-4 mr-2" />
                  <span>Symmetric Tree</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "pathsum"}
                  onClick={() => setActiveTab("pathsum")}
                >
                  <Network className="w-4 h-4 mr-2" />
                  <span>Path Sum</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "pathsum2"}
                  onClick={() => setActiveTab("pathsum2")}
                >
                  <Network className="w-4 h-4 mr-2" />
                  <span>Path Sum II</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "sumnumbers"}
                  onClick={() => setActiveTab("sumnumbers")}
                >
                  <Network className="w-4 h-4 mr-2" />
                  <span>Sum Root to Leaf</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "countnodes"}
                  onClick={() => setActiveTab("countnodes")}
                >
                  <Network className="w-4 h-4 mr-2" />
                  <span>Count Nodes</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "goodnodes"}
                  onClick={() => setActiveTab("goodnodes")}
                >
                  <Network className="w-4 h-4 mr-2" />
                  <span>Count Good Nodes</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "lca"}
                  onClick={() => setActiveTab("lca")}
                >
                  <Network className="w-4 h-4 mr-2" />
                  <span>Lowest Common Ancestor</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "isvalidbst"}
                  onClick={() => setActiveTab("isvalidbst")}
                >
                  <Network className="w-4 h-4 mr-2" />
                  <span>Validate BST</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "levelorder"}
                  onClick={() => setActiveTab("levelorder")}
                >
                  <Network className="w-4 h-4 mr-2" />
                  <span>Level Order Traversal</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "zigzaglevelorder"}
                  onClick={() => setActiveTab("zigzaglevelorder")}
                >
                  <Network className="w-4 h-4 mr-2" />
                  <span>Zigzag Level Order</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "kthsmallest"}
                  onClick={() => setActiveTab("kthsmallest")}
                >
                  <Network className="w-4 h-4 mr-2" />
                  <span>Kth Smallest in BST</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "rightsideview"}
                  onClick={() => setActiveTab("rightsideview")}
                >
                  <Network className="w-4 h-4 mr-2" />
                  <span>Right Side View</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "treevisualizer"}
                  onClick={() => setActiveTab("treevisualizer")}
                >
                  <Network className="w-4 h-4 mr-2" />
                  <span>Tree Visualizer (Builder)</span>
                </SidebarMenuButton>
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
                  isActive={activeTab === "validparentheses"}
                  onClick={() => setActiveTab("validparentheses")}
                >
                  <SquareTerminal className="w-4 h-4 mr-2" />
                  <span>Valid Parentheses</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
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
                  isActive={activeTab === "dailytemperatures"}
                  onClick={() => setActiveTab("dailytemperatures")}
                >
                  <SquareTerminal className="w-4 h-4 mr-2" />
                  <span>Daily Temperatures</span>
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
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "nextgreaterelement"}
                  onClick={() => setActiveTab("nextgreaterelement")}
                >
                  <SquareTerminal className="w-4 h-4 mr-2" />
                  <span>Next Greater Element I</span>
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
          <SidebarGroupLabel>Binary Search</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "searchinsert"}
                  onClick={() => setActiveTab("searchinsert")}
                >
                  <Search className="w-4 h-4 mr-2" />
                  <span>Search Insert Position</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "shipwithindays"}
                  onClick={() => setActiveTab("shipwithindays")}
                >
                  <Search className="w-4 h-4 mr-2" />
                  <span>Capacity To Ship Packages</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Linked List</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "sortlist"}
                  onClick={() => setActiveTab("sortlist")}
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  <span>Sort List</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "middlenode"}
                  onClick={() => setActiveTab("middlenode")}
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  <span>Middle of Linked List</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "removenthfromend"}
                  onClick={() => setActiveTab("removenthfromend")}
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  <span>Remove Nth Node</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "swappairs"}
                  onClick={() => setActiveTab("swappairs")}
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  <span>Swap Pairs</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "hascycle"}
                  onClick={() => setActiveTab("hascycle")}
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  <span>Linked List Cycle</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "reorderlist"}
                  onClick={() => setActiveTab("reorderlist")}
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  <span>Reorder List</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "rotatelist"}
                  onClick={() => setActiveTab("rotatelist")}
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  <span>Rotate List</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Arrays</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "sortedsquares"}
                  onClick={() => setActiveTab("sortedsquares")}
                >
                  <ListOrdered className="w-4 h-4 mr-2" />
                  <span>Sorted Squares</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "containsduplicate"}
                  onClick={() => setActiveTab("containsduplicate")}
                >
                  <ListOrdered className="w-4 h-4 mr-2" />
                  <span>Contains Duplicate</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "groupanagrams"}
                  onClick={() => setActiveTab("groupanagrams")}
                >
                  <ListOrdered className="w-4 h-4 mr-2" />
                  <span>Group Anagrams</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "isanagram"}
                  onClick={() => setActiveTab("isanagram")}
                >
                  <ListOrdered className="w-4 h-4 mr-2" />
                  <span>Valid Anagram</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "twosum"}
                  onClick={() => setActiveTab("twosum")}
                >
                  <ListOrdered className="w-4 h-4 mr-2" />
                  <span>Two Sum</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "threesum"}
                  onClick={() => setActiveTab("threesum")}
                >
                  <ListOrdered className="w-4 h-4 mr-2" />
                  <span>3Sum</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "validsudoku"}
                  onClick={() => setActiveTab("validsudoku")}
                >
                  <ListOrdered className="w-4 h-4 mr-2" />
                  <span>Valid Sudoku</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "longestconsecutive"}
                  onClick={() => setActiveTab("longestconsecutive")}
                >
                  <ListOrdered className="w-4 h-4 mr-2" />
                  <span>Longest Consecutive</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Recursion & DP</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "climbstairs"}
                  onClick={() => setActiveTab("climbstairs")}
                >
                  <ListOrdered className="w-4 h-4 mr-2" />
                  <span>Climbing Stairs</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "reversestring"}
                  onClick={() => setActiveTab("reversestring")}
                >
                  <ListOrdered className="w-4 h-4 mr-2" />
                  <span>Reverse String</span>
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
