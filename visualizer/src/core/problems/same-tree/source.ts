import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function isSameTree(p, q) {" },
  { line: 2, text: "  if (!p && !q) return true;" },
  { line: 3, text: "  if (!p || !q) return false;" },
  { line: 4, text: "  if (p.val !== q.val) return false;" },
  { line: 5, text: "  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);" },
  { line: 6, text: "}" },
];

export default source;
