export const countNodesCode = [
  { line: 1, text: "function countNodes(root: TreeNode | null): number {" },
  { line: 2, text: "  if (!root) return 0;" },
  { line: 3, text: "  let left = root;" },
  { line: 4, text: "  let right = root;" },
  { line: 5, text: "  let leftHeight = 0;" },
  { line: 6, text: "  let rightHeight = 0;" },
  { line: 7, text: "  while (left) {" },
  { line: 8, text: "    left = left.left!;" },
  { line: 9, text: "    leftHeight++;" },
  { line: 10, text: "  }" },
  { line: 11, text: "  while (right) {" },
  { line: 12, text: "    right = right.right!;" },
  { line: 13, text: "    rightHeight++;" },
  { line: 14, text: "  }" },
  { line: 15, text: "  if (leftHeight === rightHeight) return Math.pow(2, leftHeight) - 1;" },
  { line: 16, text: "  return 1 + countNodes(root.left) + countNodes(root.right);" },
  { line: 17, text: "}" }
];
