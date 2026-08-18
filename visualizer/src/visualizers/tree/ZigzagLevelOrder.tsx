import { useMemo, useState } from "react";
import TreeVisualizerLayout from "../../components/layout/TreeVisualizerLayout";
import TestCaseSwitcher, { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { computeLayout } from "../../core/tree/layout";
import { generateFrames } from "../../core/tree/frames/zigzagLevelOrderFrames";
import { zigzagLevelOrderCode } from "../../core/tree/sourcecode/zigzagLevelOrder";
import { TreeNode } from "../../core/tree/TreeNode";

type TreeTestCase = TestCase<TreeNode | null>;

const TEST_CASES: TreeTestCase[] = [
  {
    id: "tc1",
    name: "Classic Tree ([[3],[20,9],[15,7]])",
    data: (() => {
      const root = new TreeNode(3, "3");
      root.left = new TreeNode(9, "9");
      root.right = new TreeNode(20, "20");
      root.right.left = new TreeNode(15, "15");
      root.right.right = new TreeNode(7, "7");
      return root;
    })(),
  },
  {
    id: "tc2",
    name: "Full 3-Level ([[1],[3,2],[4,5,6,7]])",
    data: (() => {
      const root = new TreeNode(1, "1");
      root.left = new TreeNode(2, "2");
      root.right = new TreeNode(3, "3");
      root.left.left = new TreeNode(4, "4");
      root.left.right = new TreeNode(5, "5");
      root.right.left = new TreeNode(6, "6");
      root.right.right = new TreeNode(7, "7");
      return root;
    })(),
  },
  {
    id: "tc3",
    name: "Left Skewed Tree",
    data: (() => {
      const root = new TreeNode(1, "1");
      root.left = new TreeNode(2, "2");
      root.left.left = new TreeNode(3, "3");
      root.left.left.left = new TreeNode(4, "4");
      return root;
    })(),
  },
  {
    id: "tc4",
    name: "Single Node ([[1]])",
    data: new TreeNode(1, "1"),
  },
];

export default function ZigzagLevelOrder() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);

  const rootAndFrames = useMemo(() => {
    const root = TEST_CASES[testCaseIdx].data;
    return {
      root,
      frames: generateFrames(root || null),
    };
  }, [testCaseIdx]);

  const layout = useMemo(() => {
    return rootAndFrames.root
      ? computeLayout(rootAndFrames.root)
      : { nodes: [], edges: [] };
  }, [rootAndFrames.root]);

  return (
    <TreeVisualizerLayout
      title="Binary Tree Zigzag Level Order Traversal"
      theme="fuchsia"
      layout={layout}
      frames={rootAndFrames.frames}
      code={zigzagLevelOrderCode}
      sidebarTitle="Queue (BFS)"
      sidebarMode="queue"
      headerChildren={
        <TestCaseSwitcher
          testCases={TEST_CASES}
          currentIndex={testCaseIdx}
          onChange={setTestCaseIdx}
        />
      }
    />
  );
}
