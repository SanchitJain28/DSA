import { useState } from "react";
import { buildDiameterTree } from "../../core/tree/buildTree";
import { computeLayout } from "../../core/tree/layout";
import { diameterCode } from "../../core/tree/sourcecode/diameter";
import { generateFrames } from "../../core/tree/frames/diameterFrames";
import TreeVisualizerLayout from "../../components/layout/TreeVisualizerLayout";

export default function Diameter() {
  const [root] = useState(() => buildDiameterTree());
  const [layout] = useState(() => computeLayout(root));
  const [frames] = useState(() => generateFrames(root));

  return (
    <TreeVisualizerLayout
      title="Diameter of Binary Tree"
      theme="fuchsia"
      layout={layout}
      frames={frames}
      code={diameterCode}
    />
  );
}
