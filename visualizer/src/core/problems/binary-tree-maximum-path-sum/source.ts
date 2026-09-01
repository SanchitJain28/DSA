import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function maxPathSum(root) {" },
  { line: 2, text: "  let maxSum = -Infinity;" },
  { line: 3, text: "  function dfs(node) {" },
  { line: 4, text: "    if (!node) return 0;" },
  { line: 5, text: "    const leftGain = Math.max(0, dfs(node.left));" },
  { line: 6, text: "    const rightGain = Math.max(0, dfs(node.right));" },
  { line: 7, text: "    const currentPath = node.val + leftGain + rightGain;" },
  { line: 8, text: "    maxSum = Math.max(maxSum, currentPath);" },
  { line: 9, text: "    return node.val + Math.max(leftGain, rightGain);" },
  { line: 10, text: "  }" },
  { line: 11, text: "  dfs(root);" },
  { line: 12, text: "  return maxSum;" },
  { line: 13, text: "}" },
];

export default source;
