import { TreeNode } from "./TreeNode";
import type { LayoutNode, LayoutEdge } from "./types";

export function computeLayoutWithOffset(
  root: TreeNode | null,
  startX: number,
  prefix: string = ""
): {
  nodes: LayoutNode[];
  edges: LayoutEdge[];
} {
  const nodes: LayoutNode[] = [];
  const edges: LayoutEdge[] = [];

  function traverse(
    node: TreeNode | null,
    x: number,
    y: number,
    offset: number,
    parentId: string | null,
    side: string
  ) {
    if (!node) {
      if (parentId) {
        nodes.push({ id: `${prefix}${parentId}-${side}-null`, val: "null", x, y, isNull: true });
      }
      return;
    }
    const nodeId = `${prefix}${node.id}`;
    nodes.push({ id: nodeId, val: node.val, x, y });

    edges.push({
      id: `${nodeId}-left`,
      x1: x,
      y1: y,
      x2: x - offset,
      y2: y + 80,
      isNull: !node.left
    });
    traverse(node.left, x - offset, y + 80, offset / 2, node.id, "left");

    edges.push({
      id: `${nodeId}-right`,
      x1: x,
      y1: y,
      x2: x + offset,
      y2: y + 80,
      isNull: !node.right
    });
    traverse(node.right, x + offset, y + 80, offset / 2, node.id, "right");
  }

  traverse(root, startX, 40, 100, null, "root");
  return { nodes, edges };
}

export function computeLayout(root: TreeNode | null): {
  nodes: LayoutNode[];
  edges: LayoutEdge[];
} {
  return computeLayoutWithOffset(root, 300, "");
}
