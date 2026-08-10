export const postorderCode = [
  { line: 2, text: "function postorder(node, result) {" },
  { line: 3, text: "  if (!node) return;" },
  { line: 4, text: "" },
  { line: 5, text: "  postorder(node.left, result); // Visit Left" },
  { line: 6, text: "  postorder(node.right, result); // Visit Right" },
  { line: 7, text: "  result.push(node.val); // Process Node" },
  { line: 8, text: "}" },
];
