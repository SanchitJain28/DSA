import { useMemo } from "react";
import TreeVisualizerLayout from "../../components/layout/TreeVisualizerLayout";
import { buildSymmetricTree } from "../../core/tree/buildTree";
import { isSymmetricCode } from "../../core/tree/sourcecode/isSymmetric";
import { generateFrames } from "../../core/tree/frames/isSymmetricFrames";

export default function SymmetricTree() {
  const frames = useMemo(() => {
    const root = buildSymmetricTree();
    return generateFrames(root);
  }, []);

  return (
    <TreeVisualizerLayout
      title="Symmetric Tree"
      theme="teal"
      layout={frames[0].layout!} // Use the precomputed static layout
      frames={frames}
      code={isSymmetricCode}
    />
  );
}
