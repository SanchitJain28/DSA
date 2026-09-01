import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function countNodes(root) {" },
  { line: 2, text: "  if (!root) return 0;" },
  { line: 3, text: "  let lHeight = 0, rHeight = 0;" },
  { line: 4, text: "  let l = root, r = root;" },
  { line: 5, text: "  while (l) { lHeight++; l = l.left; }" },
  { line: 6, text: "  while (r) { rHeight++; r = r.right; }" },
  { line: 7, text: "  if (lHeight === rHeight) return (1 << lHeight) - 1;" },
  { line: 8, text: "  return 1 + countNodes(root.left) + countNodes(root.right);" },
  { line: 9, text: "}" },
];

export default source;
