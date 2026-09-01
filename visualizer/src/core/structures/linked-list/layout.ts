import { ListNode } from "./ListNode";
import type { LayoutNode, LayoutEdge } from "./types";

export function computeLayout(
  lists: { head: ListNode | null; label?: string }[],
  explicitNodes: ListNode[] = [],
): { nodes: LayoutNode[]; edges: LayoutEdge[] } {
  const nodes: LayoutNode[] = [];
  const edges: LayoutEdge[] = [];

  const nodeSpacingX = 100;
  const rowSpacingY = 150;

  // 1. Gather all reachable nodes and compute in-degrees
  const inDegree = new Map<string, number>();
  const allNodes = new Map<string, ListNode>();

  // Add explicitly provided nodes first
  for (const node of explicitNodes) {
    if (!allNodes.has(node.id)) {
      allNodes.set(node.id, node);
      inDegree.set(node.id, 0);
    }
  }

  for (const list of lists) {
    let curr = list.head;
    const seenInPhase1 = new Set<string>();
    while (curr) {
      if (seenInPhase1.has(curr.id)) break;
      seenInPhase1.add(curr.id);

      if (!allNodes.has(curr.id)) {
        allNodes.set(curr.id, curr);
        inDegree.set(curr.id, 0);
      }
      if (curr.next) {
        if (!allNodes.has(curr.next.id)) {
          allNodes.set(curr.next.id, curr.next);
          inDegree.set(curr.next.id, 0);
        }
      }
      curr = curr.next;
    }
  }

  // Count in-degrees
  for (const node of allNodes.values()) {
    if (node.next) {
      inDegree.set(node.next.id, (inDegree.get(node.next.id) || 0) + 1);
    }
  }

  // 2. Find root nodes (in-degree == 0)
  const rootNodes: ListNode[] = [];
  for (const node of allNodes.values()) {
    if (inDegree.get(node.id) === 0) {
      rootNodes.push(node);
    }
  }

  // If no root nodes (cycle), pick the first passed head
  if (rootNodes.length === 0 && lists.length > 0 && lists[0].head) {
    rootNodes.push(lists[0].head);
  }

  let currentY = 50;
  const nodePositions = new Map<string, { x: number; y: number }>();
  const visited = new Set<string>();

  function traverse(startNode: ListNode) {
    let curr: ListNode | null = startNode;
    let currentX = 100;
    let startedRow = false;
    let lastVisitedId: string | null = null;

    while (curr) {
      if (!visited.has(curr.id)) {
        nodePositions.set(curr.id, { x: currentX, y: currentY });
        nodes.push({
          id: curr.id,
          val: curr.val,
          x: currentX,
          y: currentY,
          isDummy: curr.val === -1,
        });
        visited.add(curr.id);
        startedRow = true;
        lastVisitedId = curr.id;
        currentX += nodeSpacingX;
      } else {
        // Re-encountered a visited node (cycle or join), stop this traversal path
        break;
      }
      curr = curr.next;
    }

    // Append null node at the true end of a list segment
    if (!curr && startedRow && lastVisitedId) {
      const nullId = `${lastVisitedId}-null`;
      nodePositions.set(nullId, { x: currentX, y: currentY });
      nodes.push({
        id: nullId,
        val: "null",
        x: currentX,
        y: currentY,
        isNull: true,
      });
    }

    if (startedRow) {
      currentY += rowSpacingY;
    }
  }

  // Traverse all root nodes first
  for (const root of rootNodes) {
    traverse(root);
  }

  // If there are any unvisited nodes (e.g. disjoint cycles), traverse them too
  for (const node of allNodes.values()) {
    if (!visited.has(node.id)) {
      traverse(node);
    }
  }

  // 3. Draw edges using computed positions
  for (const node of allNodes.values()) {
    if (node.next) {
      const sourcePos = nodePositions.get(node.id);
      const targetPos = nodePositions.get(node.next.id);
      if (sourcePos && targetPos) {
        const edgeId = `${node.id}-${node.next.id}`;

        // Calculate offset so arrow touches the edge of the 24px radius circle
        const dx = targetPos.x - sourcePos.x;
        const dy = targetPos.y - sourcePos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0) {
          const radius = 24;
          const targetOffset = radius + 4;

          edges.push({
            id: edgeId,
            x1: sourcePos.x + (dx / dist) * radius,
            y1: sourcePos.y + (dy / dist) * radius,
            x2: targetPos.x - (dx / dist) * targetOffset,
            y2: targetPos.y - (dy / dist) * targetOffset,
          });
        }
      }
    } else {
      // It has no next! Draw an edge to its null node
      const sourcePos = nodePositions.get(node.id);
      const targetPos = nodePositions.get(`${node.id}-null`);
      if (sourcePos && targetPos) {
        const edgeId = `${node.id}-null`;
        const dx = targetPos.x - sourcePos.x;
        const dy = targetPos.y - sourcePos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0) {
          const radius = 24;
          const targetOffset = 16 + 4;

          edges.push({
            id: edgeId,
            x1: sourcePos.x + (dx / dist) * radius,
            y1: sourcePos.y + (dy / dist) * radius,
            x2: targetPos.x - (dx / dist) * targetOffset,
            y2: targetPos.y - (dy / dist) * targetOffset,
            isNull: true,
          });
        }
      }
    }
  }

  return { nodes, edges };
}
