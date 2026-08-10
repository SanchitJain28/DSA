import { useState } from "react";
import { buildUnbalancedTree } from "../../core/tree/buildTree";
import { computeLayout } from "../../core/tree/layout";
import { balancedTreeCode } from "../../core/tree/sourcecode/balancedBinaryTree";
import { generateFrames } from "../../core/tree/frames/balancedBinaryTreeFrames";
import TreeVisualizerLayout from "../../components/layout/TreeVisualizerLayout";

export default function BalancedBinaryTree() {
  const [root] = useState(() => buildUnbalancedTree());
  const [layout] = useState(() => computeLayout(root));
  const [frames] = useState(() => generateFrames(root));

  return (
    <TreeVisualizerLayout
      title="Balanced Binary Tree"
      theme="rose"
      layout={layout}
      frames={frames}
      code={balancedTreeCode}
    />
  );
}
