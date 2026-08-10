export const preorderCode = [
  { line: 2, text: "function preorder(node, result) {" },
  { line: 3, text: "  if (!node) return;" },
  { line: 4, text: "" },
  { line: 5, text: "  result.push(node.val); // Process Node" },
  { line: 6, text: "  preorder(node.left, result); // Visit Left" },
  { line: 7, text: "  preorder(node.right, result); // Visit Right" },
  { line: 8, text: "}" },
];
