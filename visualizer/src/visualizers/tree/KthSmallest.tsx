import { useMemo, useState } from "react";
import TreeVisualizerLayout from "../../components/layout/TreeVisualizerLayout";
import TestCaseSwitcher, { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { computeLayout } from "../../core/tree/layout";
import { generateFrames } from "../../core/tree/frames/kthSmallestFrames";
import { kthSmallestCode } from "../../core/tree/sourcecode/kthSmallest";
import { TreeNode } from "../../core/tree/TreeNode";

interface KthSmallestTestCaseData {
  root: TreeNode | null;
  k: number;
}

type TreeTestCase = TestCase<KthSmallestTestCaseData>;

const TEST_CASES: TreeTestCase[] = [
  {
    id: "tc1",
    name: "Standard BST (k = 3)",
    data: (() => {
      const root = new TreeNode(5, "5");
      root.left = new TreeNode(3, "3");
      root.right = new TreeNode(7, "7");
      root.left.left = new TreeNode(2, "2");
      root.left.right = new TreeNode(4, "4");
      root.right.left = new TreeNode(6, "6");
      root.right.right = new TreeNode(8, "8");
      return { root, k: 3 };
    })(),
  },
  {
    id: "tc2",
    name: "Smallest (k = 1)",
    data: (() => {
      const root = new TreeNode(3, "3");
      root.left = new TreeNode(1, "1");
      root.right = new TreeNode(4, "4");
      root.left.right = new TreeNode(2, "2");
      return { root, k: 1 };
    })(),
  },
  {
    id: "tc3",
    name: "Root as Target (k = 2)",
    data: (() => {
      const root = new TreeNode(2, "2");
      root.left = new TreeNode(1, "1");
      root.right = new TreeNode(3, "3");
      return { root, k: 2 };
    })(),
  },
  {
    id: "tc4",
    name: "Larger k (k = 5)",
    data: (() => {
      const root = new TreeNode(5, "5");
      root.left = new TreeNode(3, "3");
      root.right = new TreeNode(7, "7");
      root.left.left = new TreeNode(2, "2");
      root.left.right = new TreeNode(4, "4");
      root.right.left = new TreeNode(6, "6");
      root.right.right = new TreeNode(8, "8");
      return { root, k: 5 };
    })(),
  },
];

export default function KthSmallest() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);

  const activeTestCase = TEST_CASES[testCaseIdx].data!;

  const rootAndFrames = useMemo(() => {
    const root = activeTestCase.root;
    return {
      root,
      frames: generateFrames(root, activeTestCase.k),
    };
  }, [activeTestCase]);

  const layout = useMemo(() => {
    return rootAndFrames.root
      ? computeLayout(rootAndFrames.root)
      : { nodes: [], edges: [] };
  }, [rootAndFrames.root]);

  return (
    <TreeVisualizerLayout
      title="Kth Smallest Element in a BST"
      theme="teal"
      layout={layout}
      frames={rootAndFrames.frames}
      code={kthSmallestCode}
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
