import { useMemo } from "react";
import TreeVisualizerLayout from "../../components/layout/TreeVisualizerLayout";
import { buildPathSumTree } from "../../core/tree/buildTree";
import { pathSumCode } from "../../core/tree/sourcecode/hasPathSum";
import { generateFrames } from "../../core/tree/frames/pathSumFrames";

export default function PathSum() {
  const frames = useMemo(() => {
    const root = buildPathSumTree();
    const targetSum = 22;
    return generateFrames(root, targetSum);
  }, []);

  return (
    <TreeVisualizerLayout
      title="Path Sum"
      theme="fuchsia"
      layout={frames[0].layout!} // Use the precomputed static layout
      frames={frames}
      code={pathSumCode}
    />
  );
}
