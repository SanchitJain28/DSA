import { TreeNode } from "../intro/algorithm";

function goodNodes(root: TreeNode | null): number {
  if (!root) return 0;
  let goodNodes = 0;
  function dfs(node: TreeNode | null, maxSofar: number = -Infinity) {
    if (!node) return;
    maxSofar = Math.max(maxSofar, node.val);
    if (node.val >= maxSofar) goodNodes++;
    dfs(node.left, maxSofar);
    dfs(node.right, maxSofar);
  }
  dfs(root);
  return goodNodes;
}

// Given a binary tree root, a node X in the tree is named good if in the path from root to X there are no nodes with a value greater than X.

// Return the number of good nodes in the binary tree.

// Example 1:
// Input: root = [3,1,4,3,null,1,5]
// Output: 4

// Example 2:
// Input: root = [3,3,null,4,2]
// Output: 3

// Example 3:
// Input: root = [1]
// Output: 1
// Explanation: Root is considered as good.

// Constraints:

// The number of nodes in the binary tree is in the range [1, 10^5].
// Each node's value is between [-10^4, 10^4].
