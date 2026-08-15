import { useMemo, useState } from "react";
import TreeVisualizerLayout from "../../components/layout/TreeVisualizerLayout";
import TestCaseSwitcher from "../../components/shared/TestCaseSwitcher";
import { computeLayout } from "../../core/tree/layout";
import { generateFrames } from "../../core/tree/frames/lowestCommonAncestorFrames";
import { lowestCommonAncestorCode } from "../../core/tree/sourcecode/lowestCommonAncestor";
import { TreeNode } from "../../core/tree/TreeNode";

const TEST_CASES = [
  { id: "tc1", name: "p = 2, q = 4", p: 2, q: 4 },
  { id: "tc2", name: "p = 2, q = 8", p: 2, q: 8 },
  { id: "tc3", name: "p = 3, q = 5", p: 3, q: 5 },
  { id: "tc4", name: "p = 0, q = 9", p: 0, q: 9 },
];

export default function LowestCommonAncestor() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);

  const rootAndFrames = useMemo(() => {
    const root = new TreeNode(6, "6");
    root.left = new TreeNode(2, "2");
    root.right = new TreeNode(8, "8");
    root.left.left = new TreeNode(0, "0");
    root.left.right = new TreeNode(4, "4");
    root.left.right.left = new TreeNode(3, "3");
    root.left.right.right = new TreeNode(5, "5");
    root.right.left = new TreeNode(7, "7");
    root.right.right = new TreeNode(9, "9");

    const tc = TEST_CASES[testCaseIdx];
    return { root, frames: generateFrames(root, tc.p, tc.q) };
  }, [testCaseIdx]);

  const layout = useMemo(
    () => computeLayout(rootAndFrames.root),
    [rootAndFrames.root],
  );

  return (
    <TreeVisualizerLayout
      title="Lowest Common Ancestor of a BST"
      theme="sky"
      layout={layout}
      frames={rootAndFrames.frames}
      code={lowestCommonAncestorCode}
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
