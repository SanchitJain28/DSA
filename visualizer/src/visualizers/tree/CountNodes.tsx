import { useMemo } from "react";
import TreeVisualizerLayout from "../../components/layout/TreeVisualizerLayout";
import { countNodesCode } from "../../core/tree/sourcecode/countNodes";
import { generateFrames } from "../../core/tree/frames/countNodesFrames";
import { TreeNode } from "../../core/tree/TreeNode";
import { computeLayout } from "../../core/tree/layout";

export default function CountNodes() {
  const frames = useMemo(() => {
    // A complete binary tree with 6 nodes
    //        1
    //      /   \
    //     2     3
    //   /  \   /
    //  4    5 6
    const root = new TreeNode(1, "1");
    root.left = new TreeNode(2, "2");
    root.right = new TreeNode(3, "3");
    root.left.left = new TreeNode(4, "4");
    root.left.right = new TreeNode(5, "5");
    root.right.left = new TreeNode(6, "6");

    return generateFrames(root);
  }, []);

  const layout = useMemo(() => {
    const root = new TreeNode(1, "1");
    root.left = new TreeNode(2, "2");
    root.right = new TreeNode(3, "3");
    root.left.left = new TreeNode(4, "4");
    root.left.right = new TreeNode(5, "5");
    root.right.left = new TreeNode(6, "6");
    return computeLayout(root);
  }, []);

  return (
    <TreeVisualizerLayout
      title="Count Complete Tree Nodes"
      theme="indigo"
      layout={layout}
      frames={frames}
      code={countNodesCode}
    />
  );
}
