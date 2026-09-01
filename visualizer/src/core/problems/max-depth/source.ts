import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function maxDepth(root) {" },
  { line: 2, text: "  if (!root) return 0;" },
  { line: 3, text: "  const leftDepth = maxDepth(root.left);" },
  { line: 4, text: "  const rightDepth = maxDepth(root.right);" },
  { line: 5, text: "  return 1 + Math.max(leftDepth, rightDepth);" },
  { line: 6, text: "}" },
];

export default source;
