import { useState } from "react";
import { buildStandardTree } from "../../core/tree/buildTree";
import { computeLayout } from "../../core/tree/layout";
import { postorderCode } from "../../core/tree/sourcecode/postorder";
import { generateFrames } from "../../core/tree/frames/postorderFrames";
import TreeVisualizerLayout from "../../components/layout/TreeVisualizerLayout";

export default function PostorderTraversal() {
  const [root] = useState(() => buildStandardTree());
  const [layout] = useState(() => computeLayout(root));
  const [frames] = useState(() => generateFrames(root));

  return (
    <TreeVisualizerLayout
      title="Postorder Traversal"
      theme="orange"
      layout={layout}
      frames={frames}
      code={postorderCode}
    />
  );
}
