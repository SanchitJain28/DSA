import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function preorder(node, result = []) {" },
  { line: 2, text: "  if (!node) return result;" },
  { line: 3, text: "  result.push(node.val); // Process Root" },
  { line: 4, text: "  preorder(node.left, result); // Recurse Left" },
  { line: 5, text: "  preorder(node.right, result); // Recurse Right" },
  { line: 6, text: "  return result;" },
  { line: 7, text: "}" },
];

export default source;
