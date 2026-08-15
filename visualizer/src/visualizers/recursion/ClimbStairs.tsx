import { useMemo, useState } from "react";
import TreeVisualizerLayout from "../../components/layout/TreeVisualizerLayout";
import ArrayVisualizerLayout from "../../components/layout/ArrayVisualizerLayout";
import { generateFrames as generateTreeFrames } from "../../core/recursion/frames/climbStairsTreeFrames";
import { generateDpFrames } from "../../core/recursion/frames/climbStairsDpFrames";
import { climbStairsTreeCode, climbStairsDpCode } from "../../core/recursion/sourcecode/climbStairs";

export default function ClimbStairs() {
  const [layoutMode, setLayoutMode] = useState<"tree" | "dp">("tree");

  const treeFrames = useMemo(() => {
    return generateTreeFrames(4);
  }, []);

  const dpFrames = useMemo(() => {
    return generateDpFrames(5); // DP can handle 5 easily visually
  }, []);

  const headerChildren = (
    <div className="flex bg-gray-900 rounded-lg p-1 ml-4 border border-gray-700">
      <button
        onClick={() => setLayoutMode("tree")}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
          layoutMode === "tree"
            ? "bg-emerald-600 text-white shadow-sm"
            : "text-gray-400 hover:text-white"
        }`}
      >
        Recursion Tree
      </button>
      <button
        onClick={() => setLayoutMode("dp")}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
          layoutMode === "dp"
            ? "bg-emerald-600 text-white shadow-sm"
            : "text-gray-400 hover:text-white"
        }`}
      >
        1D DP (Memo)
      </button>
    </div>
  );

  if (layoutMode === "tree") {
    return (
      <TreeVisualizerLayout
        title="Climbing Stairs"
        theme="emerald"
        layout={treeFrames[0].layout!}
        frames={treeFrames}
        code={climbStairsTreeCode}
        headerChildren={headerChildren}
      />
    );
  }

  return (
    <ArrayVisualizerLayout
      title="Climbing Stairs"
      theme="emerald"
      frames={dpFrames}
      code={climbStairsDpCode}
      headerChildren={headerChildren}
    />
  );
}
