import { TreeNode } from "../intro/algorithm";

function sumNumbers(root: TreeNode | null): number {
  function dfs(node: TreeNode | null, curr: number): number {
    if (!node) return 0;
    curr = curr * 10 + node.val;
    if (!node.left && !node.right) return curr;
    return dfs(node.left, curr) + dfs(node.right, curr);
  }
  return dfs(root, 0);
}
// You are given the root of a binary tree containing digits from 0 to 9 only.

// Each root-to-leaf path in the tree represents a number.

// For example, the root-to-leaf path 1 -> 2 -> 3 represents the number 123.
// Return the total sum of all root-to-leaf numbers. Test cases are generated so that the answer will fit in a 32-bit integer.

// A leaf node is a node with no children.

// Example 1:
// Input: root = [1,2,3]
// Output: 25

// Example 2:
// Input: root = [4,9,0,5,1]
// Output: 1026
