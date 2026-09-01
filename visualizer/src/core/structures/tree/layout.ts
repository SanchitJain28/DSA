import { TreeNode } from "./TreeNode";
import type { TreeLayoutNode, TreeLayoutEdge } from "./types";

export function computeTreeLayoutWithOffset(
  root: TreeNode | null,
  startX = 300,
  startY = 50,
  prefix = "",
  initialOffset = 120,
  levelHeight = 80,
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

    const nextOffset = Math.max(30, offset / 1.8);

    edges.push({
      id: `${nodeId}-left`,
      x1: x,
      y1: y,
      x2: x - offset,
      y2: y + levelHeight,
      isNull: !node.left,
    });
    traverse(node.left, x - offset, y + levelHeight, nextOffset, node.id, "left");

    edges.push({
      id: `${nodeId}-right`,
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
