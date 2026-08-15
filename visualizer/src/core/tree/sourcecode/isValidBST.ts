export const isValidBSTCode = [
  { line: 1, text: "function isValidBST(root: TreeNode | null): boolean {" },
  { line: 2, text: "  if (!root) return true;" },
  { line: 3, text: "  function dfs(node: TreeNode | null, min: number, max: number): boolean {" },
  { line: 4, text: "    if (!node) return true;" },
  { line: 5, text: "    if (node.val <= min || node.val >= max) return false;" },
  { line: 6, text: "    return dfs(node.left, min, node.val) && dfs(node.right, node.val, max);" },
  { line: 7, text: "  }" },
  { line: 8, text: "  return dfs(root, -Infinity, Infinity);" },
  { line: 9, text: "}" },
];
