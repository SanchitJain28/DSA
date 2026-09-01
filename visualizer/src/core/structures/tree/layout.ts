import { TreeNode } from "./TreeNode";
import type { TreeLayoutNode, TreeLayoutEdge } from "./types";

export function computeTreeLayoutWithOffset(
  root: TreeNode | null,
  startX = 300,
  startY = 40,
  prefix = "",
  initialOffset = 95,
  levelHeight = 64,
): {
  nodes: TreeLayoutNode[];
  edges: TreeLayoutEdge[];
} {
  const nodes: TreeLayoutNode[] = [];
  const edges: TreeLayoutEdge[] = [];

  function traverse(
    node: TreeNode | null,
    x: number,
    y: number,
    offset: number,
    parentId: string | null,
    side: string,
  ) {
    if (!node) {
      if (parentId) {
        nodes.push({
          id: `${prefix}${parentId}-${side}-null`,
          val: "null",
          x,
          y,
          isNull: true,
        });
      }
      return;
    }

    const nodeId = `${prefix}${node.id}`;
    nodes.push({ id: nodeId, val: node.val, x, y });

    const nextOffset = Math.max(26, offset / 1.7);

    const leftChildId = node.left
      ? `${prefix}${node.left.id}`
      : `${nodeId}-left-null`;
    edges.push({
      id: `${nodeId}-left`,
      fromId: nodeId,
      toId: leftChildId,
      x1: x,
      y1: y,
      x2: x - offset,
      y2: y + levelHeight,
      isNull: !node.left,
    });
    traverse(node.left, x - offset, y + levelHeight, nextOffset, node.id, "left");

    const rightChildId = node.right
      ? `${prefix}${node.right.id}`
      : `${nodeId}-right-null`;
    edges.push({
      id: `${nodeId}-right`,
      fromId: nodeId,
      toId: rightChildId,
      x1: x,
      y1: y,
      x2: x + offset,
      y2: y + levelHeight,
      isNull: !node.right,
    });
    traverse(node.right, x + offset, y + levelHeight, nextOffset, node.id, "right");
  }

  traverse(root, startX, startY, initialOffset, null, "root");
  return { nodes, edges };
}

export function computeTreeLayout(
  root: TreeNode | null,
  startX = 300,
): {
  nodes: TreeLayoutNode[];
  edges: TreeLayoutEdge[];
} {
  return computeTreeLayoutWithOffset(root, startX, 50, "");
}
