import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function isSubtree(root, subRoot) {" },
  { line: 2, text: "  if (!root) return false;" },
  { line: 3, text: "  if (isSameTree(root, subRoot)) return true;" },
  { line: 4, text: "  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);" },
  { line: 5, text: "}" },
];

export default source;
