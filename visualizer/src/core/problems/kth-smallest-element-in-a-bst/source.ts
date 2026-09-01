import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function kthSmallest(root, k) {" },
  { line: 2, text: "  let count = 0, result = 0;" },
  { line: 3, text: "  function inorder(node) {" },
  { line: 4, text: "    if (!node) return;" },
  { line: 5, text: "    inorder(node.left);" },
  { line: 6, text: "    count++;" },
  { line: 7, text: "    if (count === k) { result = node.val; return; }" },
  { line: 8, text: "    inorder(node.right);" },
  { line: 9, text: "  }" },
  { line: 10, text: "  inorder(root);" },
  { line: 11, text: "  return result;" },
  { line: 12, text: "}" },
];

export default source;
