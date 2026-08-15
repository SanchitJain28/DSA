import { useState } from "react";
import PreorderTraversal from "@/visualizers/tree/PreorderTraversal";
import InorderTraversal from "@/visualizers/tree/InorderTraversal";
import PostorderTraversal from "@/visualizers/tree/PostorderTraversal";
import InvertTree from "@/visualizers/tree/InvertTree";
import MaxDepth from "@/visualizers/tree/MaxDepth";
import Diameter from "@/visualizers/tree/Diameter";
import DailyTemperatures from "@/visualizers/stack/DailyTemperatures";
import BalancedBinaryTree from "@/visualizers/tree/BalancedBinaryTree";
import SameTree from "@/visualizers/tree/SameTree";
import Subtree from "@/visualizers/tree/Subtree";
import ClimbStairs from "@/visualizers/recursion/ClimbStairs";
import ReverseString from "@/visualizers/recursion/ReverseString";
import SymmetricTree from "@/visualizers/tree/SymmetricTree";
import PathSum from "@/visualizers/tree/PathSum";
import CountNodes from "@/visualizers/tree/CountNodes";
import GoodNodes from "@/visualizers/tree/GoodNodes";
import LowestCommonAncestor from "@/visualizers/tree/LowestCommonAncestor";
import IsValidBST from "@/visualizers/tree/IsValidBST";
import KthSmallest from "@/visualizers/tree/KthSmallest";
import LevelOrder from "@/visualizers/tree/LevelOrder";
import RightSideView from "@/visualizers/tree/RightSideView";
import SortList from "@/visualizers/linked-list/SortList";
import MiddleNode from "@/visualizers/linked-list/MiddleNode";
import RemoveNthFromEnd from "@/visualizers/linked-list/RemoveNthFromEnd";
import SwapPairs from "@/visualizers/linked-list/SwapPairs";
import HasCycle from "@/visualizers/linked-list/HasCycle";
import ReorderList from "@/visualizers/linked-list/ReorderList";
import SortedSquares from "@/visualizers/array/SortedSquares";
import ContainsDuplicate from "@/visualizers/array/ContainsDuplicate";
import GroupAnagrams from "@/visualizers/array/GroupAnagrams";
import IsAnagram from "@/visualizers/array/IsAnagram";
import TwoSum from "@/visualizers/array/TwoSum";
import ThreeSum from "@/visualizers/array/ThreeSum";
import ValidSudoku from "@/visualizers/array/ValidSudoku";
import AsteroidCollision from "@/visualizers/stack/AsteroidCollision";
import CarFleet from "@/visualizers/stack/CarFleet";
import NextGreaterElement from "@/visualizers/stack/NextGreaterElement";
import LongestRepeatingCharReplacement from "@/visualizers/sliding-window/LongestRepeatingCharReplacement";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { AppSidebar } from "@/components/layout/AppSidebar";

export type VisualizerType =
  | "preorder"
  | "inorder"
  | "postorder"
  | "invert"
  | "maxdepth"
  | "diameter"
  | "balanced"
  | "sametree"
  | "subtree"
  | "climbstairs"
  | "reversestring"
  | "symmetric"
  | "pathsum"
  | "countnodes"
  | "goodnodes"
  | "lca"
  | "isvalidbst"
  | "kthsmallest"
  | "levelorder"
  | "rightsideview"
  | "sortlist"
  | "middlenode"
  | "removenthfromend"
  | "swappairs"
  | "hascycle"
  | "reorderlist"
  | "sortedsquares"
  | "containsduplicate"
  | "groupanagrams"
  | "isanagram"
  | "twosum"
  | "threesum"
  | "validsudoku"
  | "dailytemperatures"
  | "asteroidcollision"
  | "carfleet"
  | "nextgreaterelement"
  | "longestcharreplacement";

function VisualizerPage() {
  const [activeTab, setActiveTab] = useState<VisualizerType>("preorder");

  return (
    <SettingsProvider>
      <SidebarProvider defaultOpen={false}>
        <div className="dark flex min-h-screen w-full bg-background text-foreground">
          <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex-1 relative min-h-0 bg-background">
              {activeTab === "preorder" && <PreorderTraversal />}
              {activeTab === "inorder" && <InorderTraversal />}
              {activeTab === "postorder" && <PostorderTraversal />}
              {activeTab === "dailytemperatures" && <DailyTemperatures />}
              {activeTab === "invert" && <InvertTree />}
              {activeTab === "maxdepth" && <MaxDepth />}
              {activeTab === "diameter" && <Diameter />}
              {activeTab === "balanced" && <BalancedBinaryTree />}
              {activeTab === "sametree" && <SameTree />}
              {activeTab === "subtree" && <Subtree />}
              {activeTab === "climbstairs" && <ClimbStairs />}
              {activeTab === "reversestring" && <ReverseString />}
              {activeTab === "symmetric" && <SymmetricTree />}
              {activeTab === "pathsum" && <PathSum />}
              {activeTab === "countnodes" && <CountNodes />}
              {activeTab === "goodnodes" && <GoodNodes />}
              {activeTab === "lca" && <LowestCommonAncestor />}
              {activeTab === "isvalidbst" && <IsValidBST />}
              {activeTab === "kthsmallest" && <KthSmallest />}
              {activeTab === "levelorder" && <LevelOrder />}
              {activeTab === "rightsideview" && <RightSideView />}
              {activeTab === "sortlist" && <SortList />}
              {activeTab === "middlenode" && <MiddleNode />}
              {activeTab === "removenthfromend" && <RemoveNthFromEnd />}
              {activeTab === "swappairs" && <SwapPairs />}
              {activeTab === "hascycle" && <HasCycle />}
              {activeTab === "reorderlist" && <ReorderList />}
              {activeTab === "sortedsquares" && <SortedSquares />}
              {activeTab === "containsduplicate" && <ContainsDuplicate />}
              {activeTab === "groupanagrams" && <GroupAnagrams />}
              {activeTab === "isanagram" && <IsAnagram />}
              {activeTab === "twosum" && <TwoSum />}
              {activeTab === "threesum" && <ThreeSum />}
              {activeTab === "validsudoku" && <ValidSudoku />}
              {activeTab === "asteroidcollision" && <AsteroidCollision />}
              {activeTab === "carfleet" && <CarFleet />}
              {activeTab === "nextgreaterelement" && <NextGreaterElement />}
              {activeTab === "longestcharreplacement" && (
                <LongestRepeatingCharReplacement />
              )}
            </div>
          </div>
        </div>
      </SidebarProvider>
    </SettingsProvider>
  );
}

export default VisualizerPage;
