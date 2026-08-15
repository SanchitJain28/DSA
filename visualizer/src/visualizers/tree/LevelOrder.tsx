import { useMemo, useState } from "react";
import TreeVisualizerLayout from "../../components/layout/TreeVisualizerLayout";
import TestCaseSwitcher, { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { computeLayout } from "../../core/tree/layout";
import { generateFrames } from "../../core/tree/frames/levelOrderFrames";
import { levelOrderCode } from "../../core/tree/sourcecode/levelOrder";
import { TreeNode } from "../../core/tree/TreeNode";

type TreeTestCase = TestCase<TreeNode | null>;

const TEST_CASES: TreeTestCase[] = [
  {
    id: "tc1",
    name: "Standard Tree",
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
    name: "Linear Tree",
    data: (() => {
      const root = new TreeNode(1, "1");
      root.right = new TreeNode(2, "2");
      root.right.right = new TreeNode(3, "3");
      return root;
    })(),
  },
  {
    id: "tc3",
    name: "Empty Tree",
    data: null,
  },
];

export default function LevelOrder() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);

  const rootAndFrames = useMemo(() => {
    const root = TEST_CASES[testCaseIdx].data;
    return { root, frames: generateFrames(root || null) };
  }, [testCaseIdx]);

  const layout = useMemo(() => {
    return rootAndFrames.root
      ? computeLayout(rootAndFrames.root)
      : { nodes: [], edges: [] };
  }, [rootAndFrames.root]);

  return (
    <TreeVisualizerLayout
      title="Level Order Traversal"
      theme="fuchsia"
      layout={layout}
      frames={rootAndFrames.frames}
      code={levelOrderCode}
      sidebarTitle="Queue"
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
