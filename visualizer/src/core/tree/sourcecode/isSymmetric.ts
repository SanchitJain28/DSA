export const isSymmetricCode = [
  { line: 1, text: "function isSymmetric(root: TreeNode | null): boolean {" },
  { line: 2, text: "  function isMirror(left: TreeNode | null, right: TreeNode | null): boolean {" },
  { line: 3, text: "    if (!left && !right) return true;" },
  { line: 4, text: "    if (!left || !right) return false;" },
  { line: 5, text: "    return (" },
  { line: 6, text: "      left.val === right.val &&" },
  { line: 7, text: "      isMirror(left.left, right.right) &&" },
  { line: 8, text: "      isMirror(left.right, right.left)" },
  { line: 9, text: "    );" },
  { line: 10, text: "  }" },
  { line: 11, text: "  return isMirror(root?.left ?? null, root?.right ?? null);" },
  { line: 12, text: "}" },
];
