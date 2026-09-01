import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function pathSum(root, targetSum) {" },
  { line: 2, text: "  const paths = [];" },
  { line: 3, text: "  function dfs(node, remaining, path) {" },
  { line: 4, text: "    if (!node) return;" },
  { line: 5, text: "    path.push(node.val);" },
  { line: 6, text: "    if (!node.left && !node.right && remaining === node.val) {" },
  { line: 7, text: "      paths.push([...path]);" },
  { line: 8, text: "    }" },
  { line: 9, text: "    dfs(node.left, remaining - node.val, path);" },
  { line: 10, text: "    dfs(node.right, remaining - node.val, path);" },
  { line: 11, text: "    path.pop(); // Backtrack" },
  { line: 12, text: "  }" },
  { line: 13, text: "  dfs(root, targetSum, []);" },
  { line: 14, text: "  return paths;" },
  { line: 15, text: "}" },
];

export default source;
