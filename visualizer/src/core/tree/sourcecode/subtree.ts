export const subtreeCode = [
  { line: 1, text: "function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {" },
  { line: 2, text: "  if (!root) return false;" },
  { line: 3, text: "  if (isSameTree(root, subRoot)) return true;" },
  { line: 4, text: "  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);" },
  { line: 5, text: "}" },
  { line: 6, text: "" },
  { line: 7, text: "function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {" },
  { line: 8, text: "  if (!p && !q) return true;" },
  { line: 9, text: "  if (!p || !q) return false;" },
  { line: 10, text: "  if (p.val !== q.val) return false;" },
  { line: 11, text: "  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);" },
  { line: 12, text: "}" },
];
