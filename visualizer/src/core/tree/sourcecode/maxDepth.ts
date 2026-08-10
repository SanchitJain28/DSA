export const maxDepthSol1Code = [
  { line: 2, text: "function maxDepth(root) {" },
  { line: 3, text: "  let maxDepth = 0;" },
  { line: 4, text: "  let currDepth = 0;" },
  { line: 5, text: "" },
  { line: 6, text: "  function dfs(node) {" },
  { line: 7, text: "    if (!node) return;" },
  { line: 8, text: "    currDepth++;" },
  { line: 9, text: "    maxDepth = Math.max(maxDepth, currDepth);" },
  { line: 10, text: "    dfs(node.left);" },
  { line: 11, text: "    dfs(node.right);" },
  { line: 12, text: "    currDepth--;" },
  { line: 13, text: "  }" },
  { line: 14, text: "" },
  { line: 15, text: "  dfs(root);" },
  { line: 16, text: "  return maxDepth;" },
  { line: 17, text: "}" },
];

export const maxDepthSol2Code = [
  { line: 2, text: "function maxDepth(root) {" },
  { line: 3, text: "  if (!root) return 0;" },
  { line: 4, text: "" },
  { line: 5, text: "  let leftDepth = maxDepth(root.left);" },
  { line: 6, text: "  let rightDepth = maxDepth(root.right);" },
  { line: 7, text: "  return 1 + Math.max(leftDepth, rightDepth);" },
  { line: 8, text: "}" },
];
