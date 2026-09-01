import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function isValidBST(root) {" },
  { line: 2, text: "  function validate(node, min, max) {" },
  { line: 3, text: "    if (!node) return true;" },
  { line: 4, text: "    if (node.val <= min || node.val >= max) return false;" },
  { line: 5, text: "    return validate(node.left, min, node.val) && validate(node.right, node.val, max);" },
  { line: 6, text: "  }" },
  { line: 7, text: "  return validate(root, -Infinity, Infinity);" },
  { line: 8, text: "}" },
];

export default source;
