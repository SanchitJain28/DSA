export const inorderCode = [
  { line: 2, text: "function inorder(node, result) {" },
  { line: 3, text: "  if (!node) return;" },
  { line: 4, text: "" },
  { line: 5, text: "  inorder(node.left, result); // Visit Left" },
  { line: 6, text: "  result.push(node.val); // Process Node" },
  { line: 7, text: "  inorder(node.right, result); // Visit Right" },
  { line: 8, text: "}" },
];
