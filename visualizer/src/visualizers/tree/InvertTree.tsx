import { useState } from "react";
import { buildStandardTree } from "../../core/tree/buildTree";
import { computeLayout } from "../../core/tree/layout";
import { invertTreeCode } from "../../core/tree/sourcecode/invertTree";
import { generateFrames } from "../../core/tree/frames/invertTreeFrames";
import TreeVisualizerLayout from "../../components/layout/TreeVisualizerLayout";

export default function InvertTree() {
  const [root] = useState(() => buildStandardTree());
  const [layout] = useState(() => computeLayout(root));
  const [frames] = useState(() => generateFrames(root));

  return (
    <TreeVisualizerLayout
      title="Invert Binary Tree"
      theme="orange"
      layout={layout}
      frames={frames}
      code={invertTreeCode}
    />
  );
}
