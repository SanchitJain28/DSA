import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function invertTree(node) {" },
  { line: 2, text: "  if (!node) return null;" },
  { line: 3, text: "  const temp = node.left;" },
  { line: 4, text: "  node.left = node.right;" },
  { line: 5, text: "  node.right = temp;" },
  { line: 6, text: "  invertTree(node.left);" },
  { line: 7, text: "  invertTree(node.right);" },
  { line: 8, text: "  return node;" },
  { line: 9, text: "}" },
];

export default source;
