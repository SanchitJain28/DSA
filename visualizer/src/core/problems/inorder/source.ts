import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function inorder(node, result = []) {" },
  { line: 2, text: "  if (!node) return result;" },
  { line: 3, text: "  inorder(node.left, result);  // Recurse Left" },
  { line: 4, text: "  result.push(node.val);       // Process Root" },
  { line: 5, text: "  inorder(node.right, result); // Recurse Right" },
  { line: 6, text: "  return result;" },
  { line: 7, text: "}" },
];

export default source;
