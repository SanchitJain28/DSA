import { useState } from "react";
import { buildStandardTree } from "../../core/tree/buildTree";
import { computeLayout } from "../../core/tree/layout";
import { maxDepthSol1Code } from "../../core/tree/sourcecode/maxDepth";
import { generateFramesSol1 } from "../../core/tree/frames/maxDepthFrames";
import TreeVisualizerLayout from "../../components/layout/TreeVisualizerLayout";

export default function MaxDepth() {
  const [root] = useState(() => buildStandardTree());
  const [layout] = useState(() => computeLayout(root));
  const [frames] = useState(() => generateFramesSol1(root));

  return (
    <TreeVisualizerLayout
      title="Maximum Depth of Binary Tree"
      theme="cyan"
      layout={layout}
      frames={frames}
      code={maxDepthSol1Code}
    />
  );
}
