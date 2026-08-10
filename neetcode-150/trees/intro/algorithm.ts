export class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

// function solve(node: TreeNode | null) {
//   if (!node) return BASE_CASE; // base case = null node

//   const left = solve(node.left); // trust left subtree
//   const right = solve(node.right); // trust right subtree

//   return COMBINE(node.val, left, right);
// }
