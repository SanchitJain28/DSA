import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { ListNode } from "../../structures/linked-list/ListNode";
import { computeLayout } from "../../structures/linked-list/layout";

export function generateFrames(data: { values: number[] }): Scene[] {
  const values = data.values;
  const builder = new FrameBuilder<Scene>();
  const callStack: string[] = [];

  if (!values || values.length === 0) {
    builder.pushFrame({
      phase: "Empty List",
      codeLine: 2,
      explanation: "List is empty. Returning null.",
      structures: {
        linkedList: {
          nodes: [{ id: "null_0", val: "null", x: 100, y: 70, isNull: true }],
          edges: [],
          pointers: {},
        },
      },
      variables: {},
    });
    return builder.getFrames();
  }

  const allNodes: ListNode[] = [];
  let head: ListNode | null = null;
  let prevNode: ListNode | null = null;

  for (let i = 0; i < values.length; i++) {
    const node = new ListNode(values[i], `node_${i}`);
    allNodes.push(node);
    if (!head) head = node;
    if (prevNode) prevNode.next = node;
    prevNode = node;
  }

  function addFrame(
    phase: string,
    codeLine: number,
    explanation: string,
    activeNodeId: string | null,
    locals: Record<string, ListNode | null>,
  ) {
    const lists = Object.entries(locals)
      .filter(([_, node]) => node !== null)
      .map(([label, head]) => ({ head, label }));

    const variables: Record<string, string> = {};
    const pointers: Record<string, string> = {};
    for (const [k, v] of Object.entries(locals)) {
      if (v) {
        variables[k] = v.val === -1 ? "Dummy" : `Node(${v.val})`;
        pointers[k] = v.id;
      } else {
        variables[k] = "null";
      }
    }

    const layout = computeLayout(lists, allNodes);

    builder.pushFrame({
      callStack: [...callStack],
      phase,
      codeLine,
      explanation,
      structures: {
        linkedList: {
          nodes: layout.nodes,
          edges: layout.edges,
          pointers,
          activeNodeId,
        },
      },
      variables,
    });
  }

  function sortList(node: ListNode | null): ListNode | null {
    callStack.push(`sortList(${node ? node.val : "null"})`);
    const locals: Record<string, ListNode | null> = { head: node };

    addFrame(
      "Sort",
      1,
      `Call sortList with head ${node ? node.val : "null"}.`,
      node?.id || null,
      locals,
    );

    if (!node || !node.next) {
      addFrame(
        "Base Case",
        2,
        `List has 0 or 1 node. Base case reached, returning.`,
        node?.id || null,
        locals,
      );
      callStack.pop();
      return node;
    }

    let slow = node;
    let fast = node;
    locals.slow = slow;
    locals.fast = fast;

    addFrame(
      "Initialize",
      3,
      `Initialize slow and fast pointers to head.`,
      slow.id,
      locals,
    );

    while (fast.next && fast.next.next) {
      addFrame(
        "Loop Condition",
        4,
        `Checking if fast.next and fast.next.next exist.`,
        fast.id,
        locals,
      );

      slow = slow.next!;
      locals.slow = slow;
      addFrame(
        "Move Slow",
        5,
        `slow moves 1 step to Node(${slow.val}).`,
        slow.id,
        locals,
      );

      fast = fast.next.next;
      locals.fast = fast;
      addFrame(
        "Move Fast",
        6,
        `fast moves 2 steps to Node(${fast.val}).`,
        fast.id,
        locals,
      );
    }

    addFrame(
      "Mid Point Found",
      7,
      `Loop ends. slow is at mid point Node(${slow.val}).`,
      slow.id,
      locals,
    );

    const mid = slow.next;
    locals.mid = mid;
    addFrame(
      "Split Halves",
      8,
      `mid is set to slow.next (${mid ? `Node(${mid.val})` : "null"}).`,
      mid?.id || null,
      locals,
    );

    slow.next = null;
    addFrame(
      "Disconnect",
      9,
      `Disconnect left half from right half (slow.next = null).`,
      slow.id,
      locals,
    );

    addFrame("Recurse Left", 10, `Recursively sort the left half.`, node.id, locals);
    const left = sortList(node);
    locals.left = left;

    addFrame(
      "Recurse Right",
      11,
      `Recursively sort the right half.`,
      mid?.id || null,
      locals,
    );
    const right = sortList(mid);
    locals.right = right;

    addFrame("Merge Halves", 12, `Merge the two sorted sub-lists.`, null, locals);
    const result = merge(left, right);

    callStack.pop();
    return result;
  }

  function merge(l1: ListNode | null, l2: ListNode | null): ListNode | null {
    callStack.push(`merge(${l1 ? l1.val : "null"}, ${l2 ? l2.val : "null"})`);
    const locals: Record<string, ListNode | null> = { l1, l2 };

    const dummy = new ListNode(-1, `dummy_${Math.random().toString(36).substr(2, 6)}`);
    locals.dummy = dummy;
    let curr = dummy;
    locals.curr = curr;

    addFrame(
      "Merge Init",
      16,
      `Initialize dummy node and curr pointer for merge.`,
      dummy.id,
      locals,
    );

    while (l1 && l2) {
      addFrame(
        "Compare Nodes",
        18,
        `Compare l1 (${l1.val}) and l2 (${l2.val}).`,
        curr.id,
        locals,
      );

      if (l1.val > l2.val) {
        addFrame("Link l2", 19, `l1 (${l1.val}) > l2 (${l2.val}). Link curr.next to l2.`, l2.id, locals);
        curr.next = l2;
        l2 = l2.next;
        locals.l2 = l2;
        addFrame("Advance l2", 20, `Advance l2.`, l2?.id || null, locals);
      } else {
        addFrame("Link l1", 21, `l1 (${l1.val}) <= l2 (${l2.val}). Link curr.next to l1.`, l1.id, locals);
        curr.next = l1;
        l1 = l1.next;
        locals.l1 = l1;
        addFrame("Advance l1", 22, `Advance l1.`, l1?.id || null, locals);
      }

      curr = curr.next!;
      locals.curr = curr;
      addFrame("Advance curr", 24, `Advance curr to Node(${curr.val}).`, curr.id, locals);
    }

    addFrame(
      "Attach Remaining",
      26,
      `Attach remaining nodes to curr.next.`,
      curr.id,
      locals,
    );
    curr.next = l1 ?? l2;

    addFrame(
      "Merge Return",
      27,
      `Return dummy.next as merged head.`,
      dummy.next?.id || null,
      locals,
    );

    callStack.pop();
    return dummy.next;
  }

  sortList(head);
  return builder.getFrames();
}

export default generateFrames;
