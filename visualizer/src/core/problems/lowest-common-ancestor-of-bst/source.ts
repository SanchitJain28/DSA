import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function lowestCommonAncestor(root, p, q) {" },
  { line: 2, text: "  let curr = root;" },
  { line: 3, text: "  while (curr) {" },
  { line: 4, text: "    if (p.val < curr.val && q.val < curr.val) {" },
  { line: 5, text: "      curr = curr.left;" },
  { line: 6, text: "    } else if (p.val > curr.val && q.val > curr.val) {" },
  { line: 7, text: "      curr = curr.right;" },
  { line: 8, text: "    } else {" },
  { line: 9, text: "      return curr;" },
  { line: 10, text: "    }" },
  { line: 11, text: "  }" },
  { line: 12, text: "  return null;" },
  { line: 13, text: "}" },
];

export default source;
