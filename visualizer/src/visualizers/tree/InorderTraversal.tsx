import { useState } from "react";
import { buildStandardTree } from "../../core/tree/buildTree";
import { computeLayout } from "../../core/tree/layout";
import { inorderCode } from "../../core/tree/sourcecode/inorder";
import { generateFrames } from "../../core/tree/frames/inorderFrames";
import TreeVisualizerLayout from "../../components/layout/TreeVisualizerLayout";

export default function InorderTraversal() {
  const [root] = useState(() => buildStandardTree());
  const [layout] = useState(() => computeLayout(root));
  const [frames] = useState(() => generateFrames(root));

  return (
    <TreeVisualizerLayout
      title="Inorder Traversal"
      theme="emerald"
      layout={layout}
      frames={frames}
      code={inorderCode}
    />
  );
}
