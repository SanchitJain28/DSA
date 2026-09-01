import { TreeNode } from "./TreeNode";
import type { TreeState } from "./types";
import { computeTreeLayout } from "./layout";

export function buildTreeFromLevelOrder(
  arr: (number | null)[],
): TreeNode | null {
  if (!arr || arr.length === 0 || arr[0] === null || arr[0] === undefined) {
    return null;
  }

  const root = new TreeNode(arr[0], "node_0");
  const queue: TreeNode[] = [root];
  let i = 1;

  while (i < arr.length && queue.length > 0) {
    const parent = queue.shift()!;

    // Left child
    if (i < arr.length) {
      const leftVal = arr[i];
      if (leftVal !== null && leftVal !== undefined) {
        parent.left = new TreeNode(leftVal, `node_${i}`);
        queue.push(parent.left);
      }
      i++;
    }

    // Right child
    if (i < arr.length) {
      const rightVal = arr[i];
      if (rightVal !== null && rightVal !== undefined) {
        parent.right = new TreeNode(rightVal, `node_${i}`);
        queue.push(parent.right);
      }
      i++;
    }
  }

  return root;
}

export function toTreeState(
  root: TreeNode | null,
  activeNodeId?: string | null,
  activeNodeIds?: string[],
  startX = 300,
): TreeState {
  const layout = computeTreeLayout(root, startX);
  return {
    nodes: layout.nodes,
    edges: layout.edges,
    activeNodeId: activeNodeId || null,
    activeNodeIds: activeNodeIds || [],
  };
}

export function deepCopyTree(node: TreeNode | null): TreeNode | null {
  if (!node) return null;
  return new TreeNode(
    node.val,
    node.id,
    deepCopyTree(node.left),
    deepCopyTree(node.right),
  );
}

// Canonical sample trees for presets
export function buildStandardTree(): TreeNode {
  const n1 = new TreeNode(1, "n1");
  const n3 = new TreeNode(3, "n3");
  const n6 = new TreeNode(6, "n6");
  const n9 = new TreeNode(9, "n9");
  const n2 = new TreeNode(2, "n2", n1, n3);
  const n7 = new TreeNode(7, "n7", n6, n9);
  const n4 = new TreeNode(4, "n4", n2, n7);
  return n4;
}

export function buildDiameterTree(): TreeNode {
  const n8 = new TreeNode(8, "n8");
  const n9 = new TreeNode(9, "n9");
  const n4 = new TreeNode(4, "n4", n8);
  const n5 = new TreeNode(5, "n5", null, n9);
  const n2 = new TreeNode(2, "n2", n4, n5);
  const n3 = new TreeNode(3, "n3");
  const n1 = new TreeNode(1, "n1", n2, n3);
  return n1;
}

export function buildUnbalancedTree(): TreeNode {
  const n6 = new TreeNode(6, "n6");
  const n4 = new TreeNode(4, "n4", n6);
  const n5 = new TreeNode(5, "n5");
  const n2 = new TreeNode(2, "n2", n4, n5);
  const n3 = new TreeNode(3, "n3");
  const n1 = new TreeNode(1, "n1", n2, n3);
  return n1;
}
