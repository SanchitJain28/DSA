import { TreeNode } from "../intro/algorithm";

function rightSideView(root: TreeNode | null): number[] {
  if (!root) return [];
  const result: number[] = [];
  const queue: TreeNode[] = [root];
  while (queue.length) {
    let levels = queue.length;
    let level = [];
    for (let i = 0; i < levels; i++) {
      const node = queue.shift()!;
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level.pop()!);
  }
  return result;
}

// Given the root of a binary tree, imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.

// Example 1:
// Input: root = [1,2,3,null,5,null,4]
// Output: [1,3,4]

// Example 2:
// Input: root = [1,2,3,4,null,null,null,5]
// Output: [1,3,4,5]

// Example 3:
// Input: root = [1,null,3]
// Output: [1,3]

// Example 4:
// Input: root = []
// Output: []
