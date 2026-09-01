import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function hasPathSum(root, targetSum) {" },
  { line: 2, text: "  if (!root) return false;" },
  { line: 3, text: "  if (!root.left && !root.right) {" },
  { line: 4, text: "    return targetSum === root.val;" },
  { line: 5, text: "  }" },
  { line: 6, text: "  const remaining = targetSum - root.val;" },
  { line: 7, text: "  return hasPathSum(root.left, remaining) || hasPathSum(root.right, remaining);" },
  { line: 8, text: "}" },
];

export default source;
