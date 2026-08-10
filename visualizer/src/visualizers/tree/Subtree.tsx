import { useMemo } from "react";
import { TreeNode } from "../../core/tree/TreeNode";
import { buildStandardTree } from "../../core/tree/buildTree";
import { subtreeCode } from "../../core/tree/sourcecode/subtree";
import { generateFrames } from "../../core/tree/frames/subtreeFrames";
import TreeVisualizerLayout from "../../components/layout/TreeVisualizerLayout";

export default function Subtree() {
  const frames = useMemo(() => {
    const root = buildStandardTree();
    const subRoot = new TreeNode(
      2,
      "sub2",
      new TreeNode(1, "sub1"),
      new TreeNode(3, "sub3"),
    );

    return generateFrames(root, subRoot);
  }, []);

  return (
    <TreeVisualizerLayout
      title="Subtree of Another Tree"
      theme="orange"
      layout={frames[0].layout!} // Use the precomputed layout from the first frame
      frames={frames}
      code={subtreeCode}
    />
  );
}
