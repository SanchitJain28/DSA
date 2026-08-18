import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
import PathSumII from "@/visualizers/tree/PathSumII";
import SumRootToLeaf from "@/visualizers/tree/SumRootToLeaf";
import CountNodes from "@/visualizers/tree/CountNodes";
import GoodNodes from "@/visualizers/tree/GoodNodes";
import LowestCommonAncestor from "@/visualizers/tree/LowestCommonAncestor";
import IsValidBST from "@/visualizers/tree/IsValidBST";
import KthSmallest from "@/visualizers/tree/KthSmallest";
import LevelOrder from "@/visualizers/tree/LevelOrder";
import ZigzagLevelOrder from "@/visualizers/tree/ZigzagLevelOrder";
import RightSideView from "@/visualizers/tree/RightSideView";
import TreeVisualizer from "@/visualizers/tree/TreeVisualizer";
import SortList from "@/visualizers/linked-list/SortList";
import MiddleNode from "@/visualizers/linked-list/MiddleNode";
import RemoveNthFromEnd from "@/visualizers/linked-list/RemoveNthFromEnd";
import SwapPairs from "@/visualizers/linked-list/SwapPairs";
import HasCycle from "@/visualizers/linked-list/HasCycle";
import ReorderList from "@/visualizers/linked-list/ReorderList";
import RotateList from "@/visualizers/linked-list/RotateList";
import SortedSquares from "@/visualizers/array/SortedSquares";
import ContainsDuplicate from "@/visualizers/array/ContainsDuplicate";
import GroupAnagrams from "@/visualizers/array/GroupAnagrams";
import IsAnagram from "@/visualizers/array/IsAnagram";
import TwoSum from "@/visualizers/array/TwoSum";
import ThreeSum from "@/visualizers/array/ThreeSum";
import ValidSudoku from "@/visualizers/array/ValidSudoku";
import LongestConsecutive from "@/visualizers/array/LongestConsecutive";
import AsteroidCollision from "@/visualizers/stack/AsteroidCollision";
import ValidParentheses from "@/visualizers/stack/ValidParentheses";
import CarFleet from "@/visualizers/stack/CarFleet";
import NextGreaterElement from "@/visualizers/stack/NextGreaterElement";
import LongestRepeatingCharReplacement from "@/visualizers/sliding-window/LongestRepeatingCharReplacement";
import SearchInsertPosition from "@/visualizers/binary-search/SearchInsertPosition";
import ShipWithinDays from "@/visualizers/binary-search/ShipWithinDays";
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
  | "pathsum2"
  | "sumnumbers"
  | "countnodes"
  | "goodnodes"
  | "lca"
  | "isvalidbst"
  | "kthsmallest"
  | "levelorder"
  | "zigzaglevelorder"
  | "rightsideview"
  | "treevisualizer"
  | "sortlist"
  | "middlenode"
  | "removenthfromend"
  | "swappairs"
  | "hascycle"
  | "reorderlist"
  | "rotatelist"
  | "sortedsquares"
  | "containsduplicate"
  | "groupanagrams"
  | "isanagram"
  | "twosum"
  | "threesum"
  | "validsudoku"
  | "longestconsecutive"
  | "dailytemperatures"
  | "validparentheses"
  | "asteroidcollision"
  | "carfleet"
  | "nextgreaterelement"
  | "longestcharreplacement"
  | "searchinsert"
  | "shipwithindays";

function VisualizerPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const problemFromUrl = searchParams.get("problem") as VisualizerType | null;

  const [activeTab, setActiveTab] = useState<VisualizerType>(
    problemFromUrl || "twosum"
  );

  // Sync URL when activeTab changes
  const handleTabChange = (tab: VisualizerType) => {
    setActiveTab(tab);
    setSearchParams({ problem: tab });
  };

  // Sync state if URL search param changes externally
  useEffect(() => {
    if (problemFromUrl && problemFromUrl !== activeTab) {
      setActiveTab(problemFromUrl);
    }
  }, [problemFromUrl]);

  return (
    <SettingsProvider>
      <SidebarProvider defaultOpen={false}>
        <div className="dark flex min-h-screen w-full bg-background text-foreground">
          <AppSidebar activeTab={activeTab} setActiveTab={handleTabChange} />
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
              {activeTab === "pathsum2" && <PathSumII />}
              {activeTab === "sumnumbers" && <SumRootToLeaf />}
              {activeTab === "countnodes" && <CountNodes />}
              {activeTab === "goodnodes" && <GoodNodes />}
              {activeTab === "lca" && <LowestCommonAncestor />}
              {activeTab === "isvalidbst" && <IsValidBST />}
              {activeTab === "kthsmallest" && <KthSmallest />}
              {activeTab === "levelorder" && <LevelOrder />}
              {activeTab === "zigzaglevelorder" && <ZigzagLevelOrder />}
              {activeTab === "rightsideview" && <RightSideView />}
              {activeTab === "treevisualizer" && <TreeVisualizer />}
              {activeTab === "sortlist" && <SortList />}
              {activeTab === "middlenode" && <MiddleNode />}
              {activeTab === "removenthfromend" && <RemoveNthFromEnd />}
              {activeTab === "swappairs" && <SwapPairs />}
              {activeTab === "hascycle" && <HasCycle />}
              {activeTab === "reorderlist" && <ReorderList />}
              {activeTab === "rotatelist" && <RotateList />}
              {activeTab === "sortedsquares" && <SortedSquares />}
              {activeTab === "containsduplicate" && <ContainsDuplicate />}
              {activeTab === "groupanagrams" && <GroupAnagrams />}
              {activeTab === "isanagram" && <IsAnagram />}
              {activeTab === "twosum" && <TwoSum />}
              {activeTab === "threesum" && <ThreeSum />}
              {activeTab === "validsudoku" && <ValidSudoku />}
              {activeTab === "longestconsecutive" && <LongestConsecutive />}
              {activeTab === "validparentheses" && <ValidParentheses />}
              {activeTab === "asteroidcollision" && <AsteroidCollision />}
              {activeTab === "carfleet" && <CarFleet />}
              {activeTab === "nextgreaterelement" && <NextGreaterElement />}
              {activeTab === "longestcharreplacement" && (
                <LongestRepeatingCharReplacement />
              )}
              {activeTab === "searchinsert" && <SearchInsertPosition />}
              {activeTab === "shipwithindays" && <ShipWithinDays />}
            </div>
          </div>
        </div>
      </SidebarProvider>
    </SettingsProvider>
  );
}

export default VisualizerPage;
