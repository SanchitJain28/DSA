import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function isSymmetric(root) {" },
  { line: 2, text: "  if (!root) return true;" },
  { line: 3, text: "  function isMirror(t1, t2) {" },
  { line: 4, text: "    if (!t1 && !t2) return true;" },
  { line: 5, text: "    if (!t1 || !t2) return false;" },
  { line: 6, text: "    if (t1.val !== t2.val) return false;" },
  { line: 7, text: "    return isMirror(t1.left, t2.right) && isMirror(t1.right, t2.left);" },
  { line: 8, text: "  }" },
  { line: 9, text: "  return isMirror(root.left, root.right);" },
  { line: 10, text: "}" },
];

export default source;
