import { useMemo, useState } from "react";
import TreeVisualizerLayout from "../../components/layout/TreeVisualizerLayout";
import TestCaseSwitcher, { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { computeLayout } from "../../core/tree/layout";
import { generateFrames } from "../../core/tree/frames/goodNodesFrames";
import { goodNodesCode } from "../../core/tree/sourcecode/goodNodes";
import { TreeNode } from "../../core/tree/TreeNode";

type TreeTestCase = TestCase<TreeNode | null>;

const TEST_CASES: TreeTestCase[] = [
  {
    id: "tc1",
    name: "Standard Tree (4 Good Nodes)",
    data: (() => {
      const root = new TreeNode(3, "3");
      root.left = new TreeNode(1, "1");
      root.right = new TreeNode(4, "4");
      root.left.left = new TreeNode(3, "3_left");
      root.right.left = new TreeNode(1, "1_right");
      root.right.right = new TreeNode(5, "5");
      return root;
    })(),
  },
  {
    id: "tc2",
    name: "Branching Tree (3 Good Nodes)",
    data: (() => {
      const root = new TreeNode(3, "3");
      root.left = new TreeNode(3, "3_sub");
      root.left.left = new TreeNode(4, "4");
      root.left.right = new TreeNode(2, "2");
      return root;
    })(),
  },
  {
    id: "tc3",
    name: "Decreasing Path (1 Good Node)",
    data: (() => {
      const root = new TreeNode(9, "9");
      root.right = new TreeNode(3, "3");
      root.right.right = new TreeNode(6, "6");
      return root;
    })(),
  },
  {
    id: "tc4",
    name: "Increasing Path (4 Good Nodes)",
    data: (() => {
      const root = new TreeNode(1, "1");
      root.left = new TreeNode(2, "2");
      root.left.left = new TreeNode(3, "3");
      root.left.left.right = new TreeNode(4, "4");
      return root;
    })(),
  },
];

export default function GoodNodes() {
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
      title="Count Good Nodes in Binary Tree"
      theme="emerald"
      layout={layout}
      frames={rootAndFrames.frames}
      code={goodNodesCode}
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
