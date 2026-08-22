import { useMemo, useState } from "react";
import TreeVisualizerLayout from "../../components/layout/TreeVisualizerLayout";
import TestCaseSwitcher, { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { computeLayout } from "../../core/tree/layout";
import { generateFrames } from "../../core/tree/frames/rightSideViewFrames";
import { rightSideViewCode } from "../../core/tree/sourcecode/rightSideView";
import { TreeNode } from "../../core/tree/TreeNode";

type TreeTestCase = TestCase<TreeNode | null>;

const TEST_CASES: TreeTestCase[] = [
  {
    id: "tc1",
    name: "Standard Tree ([1, 3, 4])",
    data: (() => {
      const root = new TreeNode(1, "1");
      root.left = new TreeNode(2, "2");
      root.right = new TreeNode(3, "3");
      root.left.right = new TreeNode(5, "5");
      root.right.right = new TreeNode(4, "4");
      return root;
    })(),
  },
  {
    id: "tc2",
    name: "Left Deeper ([1, 3, 4, 5])",
    data: (() => {
      const root = new TreeNode(1, "1");
      root.left = new TreeNode(2, "2");
      root.right = new TreeNode(3, "3");
      root.left.left = new TreeNode(4, "4");
      root.left.left.left = new TreeNode(5, "5");
      return root;
    })(),
  },
  {
    id: "tc3",
    name: "Right Chain ([1, 2, 3])",
    data: (() => {
      const root = new TreeNode(1, "1");
      root.right = new TreeNode(2, "2");
      root.right.right = new TreeNode(3, "3");
      return root;
    })(),
  },
  {
    id: "tc4",
    name: "Full Binary Tree ([1, 3, 7])",
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
];

export default function RightSideView() {
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
      title="Binary Tree Right Side View"
      theme="indigo"
      layout={layout}
      frames={rootAndFrames.frames}
      code={rightSideViewCode}
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
