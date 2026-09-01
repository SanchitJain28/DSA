import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function isBalanced(root) {" },
  { line: 2, text: "  let balanced = true;" },
  { line: 3, text: "  function height(node) {" },
  { line: 4, text: "    if (!node) return 0;" },
  { line: 5, text: "    const left = height(node.left);" },
  { line: 6, text: "    const right = height(node.right);" },
  { line: 7, text: "    if (Math.abs(left - right) > 1) balanced = false;" },
  { line: 8, text: "    return 1 + Math.max(left, right);" },
  { line: 9, text: "  }" },
  { line: 10, text: "  height(root);" },
  { line: 11, text: "  return balanced;" },
  { line: 12, text: "}" },
];

export default source;
