export const lowestCommonAncestorCode = [
  { line: 1, text: "function lowestCommonAncestor(" },
  { line: 2, text: "  root: TreeNode | null," },
  { line: 3, text: "  p: TreeNode," },
  { line: 4, text: "  q: TreeNode" },
  { line: 5, text: "): TreeNode | null {" },
  { line: 6, text: "  if (!root) return null;" },
  { line: 7, text: "  if (p.val < root.val && q.val < root.val)" },
  { line: 8, text: "    return lowestCommonAncestor(root.left, p, q);" },
  { line: 9, text: "  else if (p.val > root.val && q.val > root.val)" },
  { line: 10, text: "    return lowestCommonAncestor(root.right, p, q);" },
  { line: 11, text: "  else return root;" },
  { line: 12, text: "}" }
];
