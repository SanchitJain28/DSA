import { useState } from "react";
import { buildStandardTree } from "../../core/tree/buildTree";
import { computeLayout } from "../../core/tree/layout";
import { preorderCode } from "../../core/tree/sourcecode/preorder";
import { generateFrames } from "../../core/tree/frames/preorderFrames";
import TreeVisualizerLayout from "../../components/layout/TreeVisualizerLayout";

export default function PreorderTraversal() {
  const [root] = useState(() => buildStandardTree());
  const [layout] = useState(() => computeLayout(root));
  const [frames] = useState(() => generateFrames(root));

  return (
    <TreeVisualizerLayout
      title="Preorder Traversal"
      theme="teal"
      layout={layout}
      frames={frames}
      code={preorderCode}
    />
  );
}
