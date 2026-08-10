// Given the root of a binary tree, invert the tree, and return its root.

import { TreeNode } from "../intro/algorithm";

// Example 1:

function invertTree(root: TreeNode | null): TreeNode | null {
  if (!root) return null;
  function dfs(node: TreeNode | null) {
    if (!node) return;
    dfs(node.left);
    dfs(node.right);
    let leftNode = node.left;
    node.left = node.right;
    node.right = leftNode;
  }
  dfs(root);
  return root;
}

// Input: root = [4,2,7,1,3,6,9]
// Output: [4,7,2,9,6,3,1]
// Example 2:

// Input: root = [2,1,3]
// Output: [2,3,1]
// Example 3:

// Input: root = []
// Output: []
