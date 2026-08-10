import { useState } from "react";
import PreorderTraversal from "@/visualizers/tree/PreorderTraversal";
import InorderTraversal from "@/visualizers/tree/InorderTraversal";
import PostorderTraversal from "@/visualizers/tree/PostorderTraversal";
import InvertTree from "@/visualizers/tree/InvertTree";
import MaxDepth from "@/visualizers/tree/MaxDepth";
import Diameter from "@/visualizers/tree/Diameter";
import BalancedBinaryTree from "@/visualizers/tree/BalancedBinaryTree";
import SameTree from "@/visualizers/tree/SameTree";
import Subtree from "@/visualizers/tree/Subtree";
import SymmetricTree from "@/visualizers/tree/SymmetricTree";
import PathSum from "@/visualizers/tree/PathSum";
import CountNodes from "@/visualizers/tree/CountNodes";
import SortList from "@/visualizers/linked-list/SortList";
import SortedSquares from "@/visualizers/array/SortedSquares";
import AsteroidCollision from "@/visualizers/stack/AsteroidCollision";
import CarFleet from "@/visualizers/stack/CarFleet";
import LongestRepeatingCharReplacement from "@/visualizers/sliding-window/LongestRepeatingCharReplacement";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { AppSidebar } from "@/components/layout/AppSidebar";

function VisualizerPage() {
  const [activeTab, setActiveTab] = useState<
    | "preorder"
    | "inorder"
    | "postorder"
    | "invert"
    | "maxdepth"
    | "diameter"
    | "balanced"
    | "sametree"
    | "subtree"
    | "symmetric"
    | "pathsum"
    | "countnodes"
    | "sortlist"
    | "sortedsquares"
    | "asteroidcollision"
    | "carfleet"
    | "longestcharreplacement"
  >("preorder");

  return (
    <SettingsProvider>
      <SidebarProvider defaultOpen={false}>
        <div className="flex min-h-screen w-full bg-gray-950">
          <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="flex flex-col flex-1 min-w-0">
            {/* Navigation */}
            <nav className="bg-gray-900 border-b border-gray-800 p-4 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setActiveTab("preorder")}
                className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                  activeTab === "preorder"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                }`}
              >
                Preorder Traversal
              </button>
              <button
                onClick={() => setActiveTab("inorder")}
                className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                  activeTab === "inorder"
                    ? "bg-green-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                }`}
              >
                Inorder Traversal
              </button>
              <button
                onClick={() => setActiveTab("postorder")}
                className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                  activeTab === "postorder"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                }`}
              >
                Postorder Traversal
              </button>
              <button
                onClick={() => setActiveTab("invert")}
                className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                  activeTab === "invert"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                }`}
              >
                Invert Binary Tree
              </button>
              <button
                onClick={() => setActiveTab("maxdepth")}
                className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                  activeTab === "maxdepth"
                    ? "bg-cyan-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                }`}
              >
                Max Depth
              </button>
              <button
                onClick={() => setActiveTab("diameter")}
                className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                  activeTab === "diameter"
                    ? "bg-fuchsia-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                }`}
              >
                Diameter
              </button>
              <button
                onClick={() => setActiveTab("balanced")}
                className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                  activeTab === "balanced"
                    ? "bg-rose-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                }`}
              >
                Balanced Binary Tree
              </button>
              <button
                onClick={() => setActiveTab("sametree")}
                className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                  activeTab === "sametree"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                }`}
              >
                Same Tree
              </button>
              <button
                onClick={() => setActiveTab("subtree")}
                className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                  activeTab === "subtree"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                Subtree of Another Tree
              </button>
              <button
                onClick={() => setActiveTab("symmetric")}
                className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                  activeTab === "symmetric"
                    ? "bg-teal-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                Symmetric Tree
              </button>
              <button
                onClick={() => setActiveTab("pathsum")}
                className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                  activeTab === "pathsum"
                    ? "bg-fuchsia-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                Path Sum
              </button>
              <button
                onClick={() => setActiveTab("countnodes")}
                className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                  activeTab === "countnodes"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                Count Complete Nodes
              </button>
              <button
                onClick={() => setActiveTab("sortlist")}
                className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                  activeTab === "sortlist"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                Sort List
              </button>
              <button
                onClick={() => setActiveTab("sortedsquares")}
                className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                  activeTab === "sortedsquares"
                    ? "bg-sky-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                Squares of Sorted Array
              </button>
              <button
                onClick={() => setActiveTab("asteroidcollision")}
                className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                  activeTab === "asteroidcollision"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                Asteroid Collision
              </button>
              <button
                onClick={() => setActiveTab("carfleet")}
                className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                  activeTab === "carfleet"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                Car Fleet
              </button>
              <button
                onClick={() => setActiveTab("longestcharreplacement")}
                className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                  activeTab === "longestcharreplacement"
                    ? "bg-rose-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                Longest Character Replacement
              </button>
            </nav>

            {/* Main Content Area */}
            <div className="flex-1 relative min-h-0 bg-gray-950">
              {activeTab === "preorder" && <PreorderTraversal />}
              {activeTab === "inorder" && <InorderTraversal />}
              {activeTab === "postorder" && <PostorderTraversal />}
              {activeTab === "invert" && <InvertTree />}
              {activeTab === "maxdepth" && <MaxDepth />}
              {activeTab === "diameter" && <Diameter />}
              {activeTab === "balanced" && <BalancedBinaryTree />}
              {activeTab === "sametree" && <SameTree />}
              {activeTab === "subtree" && <Subtree />}
              {activeTab === "symmetric" && <SymmetricTree />}
              {activeTab === "pathsum" && <PathSum />}
              {activeTab === "countnodes" && <CountNodes />}
              {activeTab === "sortlist" && <SortList />}
              {activeTab === "sortedsquares" && <SortedSquares />}
              {activeTab === "asteroidcollision" && <AsteroidCollision />}
              {activeTab === "carfleet" && <CarFleet />}
              {activeTab === "longestcharreplacement" && <LongestRepeatingCharReplacement />}
            </div>
          </div>
        </div>
      </SidebarProvider>
    </SettingsProvider>
  );
}

export default VisualizerPage;
