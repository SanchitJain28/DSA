export const invertTreeCode = [
  { line: 2, text: "function invertTree(node) {" },
  { line: 3, text: "  if (!node) return null;" },
  { line: 4, text: "" },
  { line: 5, text: "  const temp = node.left;" },
  { line: 6, text: "  node.left = node.right;" },
  { line: 7, text: "  node.right = temp;" },
  { line: 8, text: "" },
  { line: 9, text: "  invertTree(node.left);" },
  { line: 10, text: "  invertTree(node.right);" },
  { line: 11, text: "  return node;" },
  { line: 12, text: "}" },
];
