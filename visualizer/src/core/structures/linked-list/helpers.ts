import { ListNode } from "./ListNode";
import { computeLayout } from "./layout";
import type { LinkedListState } from "./types";

export function toLinkedListState(
  lists: { head: ListNode | null; label?: string }[],
  explicitNodes: ListNode[] = [],
  pointers: Record<string, string> = {},
  activeNodeId: string | null = null,
): LinkedListState {
  const { nodes, edges } = computeLayout(lists, explicitNodes);
  return {
    nodes,
    edges,
    pointers,
    activeNodeId,
  };
}

export function buildLinkedList(values: number[]): {
  head: ListNode | null;
  nodes: ListNode[];
} {
  if (values.length === 0) return { head: null, nodes: [] };

  const nodes: ListNode[] = [];
  let head: ListNode | null = null;
  let curr: ListNode | null = null;

  for (let i = 0; i < values.length; i++) {
    const node = new ListNode(values[i], `node-${i}`);
    nodes.push(node);
    if (!head) {
      head = node;
      curr = head;
    } else {
      curr!.next = node;
      curr = node;
    }
  }

  return { head, nodes };
}
