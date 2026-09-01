import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function sumNumbers(root) {" },
  { line: 2, text: "  function dfs(node, curr) {" },
  { line: 3, text: "    if (!node) return 0;" },
  { line: 4, text: "    curr = curr * 10 + node.val;" },
  { line: 5, text: "    if (!node.left && !node.right) return curr;" },
  { line: 6, text: "    return dfs(node.left, curr) + dfs(node.right, curr);" },
  { line: 7, text: "  }" },
  { line: 8, text: "  return dfs(root, 0);" },
  { line: 9, text: "}" },
];

export default source;
