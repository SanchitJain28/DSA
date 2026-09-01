import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import type { TreeLayoutEdge, TreeLayoutNode, TreeState } from "../../structures/tree/types";

export interface HeapAction {
  type: "add" | "poll" | "peek";
  value?: number;
}

function parseActions(actionsStr: string): HeapAction[] {
  const parts = actionsStr
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const actions: HeapAction[] = [];
  for (const part of parts) {
    const lower = part.toLowerCase();
    if (lower.startsWith("add:") || lower.startsWith("add(")) {
      const numStr = lower.replace(/[^0-9-]/g, "");
      const val = parseInt(numStr, 10);
      if (!isNaN(val)) actions.push({ type: "add", value: val });
    } else if (lower.startsWith("add")) {
      const numStr = lower.replace(/[^0-9-]/g, "");
      const val = parseInt(numStr, 10);
      if (!isNaN(val)) actions.push({ type: "add", value: val });
    } else if (lower.startsWith("poll")) {
      actions.push({ type: "poll" });
    } else if (lower.startsWith("peek")) {
      actions.push({ type: "peek" });
    } else {
      const val = parseInt(part, 10);
      if (!isNaN(val)) actions.push({ type: "add", value: val });
    }
  }
  return actions;
}

function computeHeapTreeState(
  heap: number[],
  activeIdx: number | null = null,
  secondaryIndices: number[] = [],
  targetIndices: number[] = [],
  successIndices: number[] = [],
): TreeState {
  const n = heap.length;
  if (n === 0) {
    return { nodes: [], edges: [] };
  }

  const maxLevel = Math.floor(Math.log2(n));
  const leafCount = Math.pow(2, maxLevel);
  const totalWidth = Math.max(500, leafCount * 65);
  const levelHeight = 65;

  const nodes: TreeLayoutNode[] = [];
  const edges: TreeLayoutEdge[] = [];

  for (let i = 0; i < n; i++) {
    const level = Math.floor(Math.log2(i + 1));
    const countAtLevel = Math.pow(2, level);
    const posInLevel = i - (countAtLevel - 1);
    const slotWidth = totalWidth / countAtLevel;
    const x = Math.round(slotWidth * (posInLevel + 0.5));
    const y = Math.round(35 + level * levelHeight);

    let status: TreeLayoutNode["status"] = undefined;
    if (successIndices.includes(i)) status = "success";
    else if (targetIndices.includes(i)) status = "target";
    else if (activeIdx === i) status = "active";
    else if (secondaryIndices.includes(i)) status = "secondary";

    nodes.push({
      id: `heap-${i}`,
      val: heap[i],
      x,
      y,
      status,
    });

    if (i > 0) {
      const parentIdx = Math.floor((i - 1) / 2);
      const parentNode = nodes[parentIdx];
      edges.push({
        id: `heap-edge-${parentIdx}-${i}`,
        x1: parentNode.x,
        y1: parentNode.y + 16,
        x2: x,
        y2: y - 16,
      });
    }
  }

  return {
    nodes,
    edges,
    activeNodeId: activeIdx !== null ? `heap-${activeIdx}` : null,
  };
}

export function generateFrames(data: { actions: string }): Scene[] {
  const actions = parseActions(data.actions || "");
  const builder = new FrameBuilder<Scene>();
  const heap: number[] = [];
  const callStack: string[] = [];

  const pushFrame = (
    phase: string,
    codeLine: number,
    explanation: string,
    activeIdx: number | null = null,
    pointers: Record<string, number> = {},
    variables: Record<string, string | number> = {},
    secondaryIndices: number[] = [],
    targetIndices: number[] = [],
    successIndices: number[] = [],
  ) => {
    const treeState = computeHeapTreeState(
      heap,
      activeIdx,
      secondaryIndices,
      targetIndices,
      successIndices,
    );

    builder.pushFrame({
      phase,
      codeLine,
      explanation,
      callStack: [...callStack],
      structures: {
        tree: treeState,
        arrays: [
          {
            id: "heap-array",
            name: "MinHeap Backing Array (heap[0 .. n-1])",
            values: [...heap],
            pointers: Object.keys(pointers).length > 0 ? { ...pointers } : undefined,
          },
        ],
      },
      variables: {
        heapSize: heap.length,
        ...variables,
      },
    });
  };

  pushFrame(
    "Initialization",
    1,
    `Initialized empty MinHeap. Processing ${actions.length} operations.`,
    null,
    {},
    { operation: "Idle" },
  );

  for (const action of actions) {
    if (action.type === "add" && action.value !== undefined) {
      const val = action.value;
      callStack.push(`add(${val})`);

      // 1. Push value to end of heap
      heap.push(val);
      const insertedIdx = heap.length - 1;

      pushFrame(
        `add(${val}) -> Append to array`,
        5,
        `heap.push(${val}): Inserted ${val} at index #${insertedIdx} (end of array).`,
        insertedIdx,
        { INSERT: insertedIdx },
        { operation: `add(${val})`, index: insertedIdx, val },
        [],
        [insertedIdx],
      );

      // 2. Call _heapifyUp
      callStack.push(`_heapifyUp()`);
      pushFrame(
        `_heapifyUp() -> Restore Min-Heap`,
        6,
        `Calling _heapifyUp() to bubble up ${val} until parent <= child.`,
        insertedIdx,
        { CURR: insertedIdx },
        { operation: `_heapifyUp()`, index: insertedIdx },
      );

      let index = insertedIdx;
      pushFrame(
        `_heapifyUp: index = ${index}`,
        19,
        `Set index = ${index}. Begin upward traversal.`,
        index,
        { CURR: index },
        { operation: `_heapifyUp()`, index },
      );

      while (index > 0) {
        const parentIdx = Math.floor((index - 1) / 2);

        pushFrame(
          `Compare with Parent #${parentIdx}`,
          21,
          `parentIdx = ⌊(${index} - 1) / 2⌋ = ${parentIdx}. Compare parent heap[${parentIdx}] (${heap[parentIdx]}) vs child heap[${index}] (${heap[index]}).`,
          index,
          { PARENT: parentIdx, CURR: index },
          {
            operation: `_heapifyUp()`,
            index,
            parentIndex: parentIdx,
            comparison: `${heap[parentIdx]} <= ${heap[index]} ?`,
          },
          [parentIdx],
        );

        if (heap[parentIdx] <= heap[index]) {
          pushFrame(
            `Min-Heap Property Holds`,
            22,
            `heap[${parentIdx}] (${heap[parentIdx]}) <= heap[${index}] (${heap[index]}). Min-heap property satisfied! Bubble up complete.`,
            index,
            { CURR: index },
            {
              operation: `_heapifyUp()`,
              index,
              parentIndex: parentIdx,
              comparison: `Valid (${heap[parentIdx]} <= ${heap[index]})`,
            },
            [],
            [],
            [index],
          );
          break;
        }

        // Violation -> swap
        pushFrame(
          `Swap #${parentIdx} <-> #${index}`,
          23,
          `heap[${parentIdx}] (${heap[parentIdx]}) > heap[${index}] (${heap[index]}). Violation! Swap parent and child.`,
          index,
          { SWAP_PARENT: parentIdx, SWAP_CHILD: index },
          {
            operation: `_heapifyUp()`,
            index,
            parentIndex: parentIdx,
            comparison: `Violated (${heap[parentIdx]} > ${heap[index]})`,
          },
          [],
          [parentIdx, index],
        );

        // Execute swap
        const tmp = heap[parentIdx];
        heap[parentIdx] = heap[index];
        heap[index] = tmp;
        index = parentIdx;

        pushFrame(
          `Swapped -> index = ${index}`,
          24,
          `Swapped values! index updated to parent position ${index}.`,
          index,
          { CURR: index },
          { operation: `_heapifyUp()`, index },
          [],
          [],
          [index],
        );
      }

      callStack.pop(); // pop _heapifyUp
      callStack.pop(); // pop add
    } else if (action.type === "poll") {
      callStack.push(`poll()`);

      if (heap.length === 0) {
        pushFrame(
          `poll() on Empty Heap`,
          10,
          `Heap is empty. Returning null.`,
          null,
          {},
          { operation: "poll()", result: "null" },
        );
        callStack.pop();
        continue;
      }

      if (heap.length === 1) {
        const rootVal = heap.pop()!;
        pushFrame(
          `poll() Single Element`,
          11,
          `Heap has only 1 element. Popped root ${rootVal}. Heap is now empty.`,
          null,
          {},
          { operation: "poll()", polledValue: rootVal },
        );
        callStack.pop();
        continue;
      }

      // Root extraction
      const rootVal = heap[0];
      const lastVal = heap.pop()!;
      heap[0] = lastVal;

      pushFrame(
        `Extract Root (${rootVal}) & Move Last Leaf (${lastVal}) to Root`,
        13,
        `Polled minimum value ${rootVal}. Moved last leaf ${lastVal} to root position (index 0).`,
        0,
        { ROOT: 0 },
        { operation: "poll()", polledValue: rootVal, newRoot: lastVal },
        [],
        [0],
      );

      // Call _heapifyDown
      callStack.push(`_heapifyDown()`);
      pushFrame(
        `_heapifyDown() -> Restore Min-Heap`,
        14,
        `Call _heapifyDown() to sift down ${lastVal} to its correct position.`,
        0,
        { CURR: 0 },
        { operation: "_heapifyDown()", index: 0 },
      );

      let index = 0;
      const length = heap.length;

      while (true) {
        const leftIdx = 2 * index + 1;
        const rightIdx = 2 * index + 2;
        let smallestIdx = index;

        const activePointers: Record<string, number> = { CURR: index };
        const secondaryList: number[] = [];

        if (leftIdx < length) {
          activePointers.LEFT = leftIdx;
          secondaryList.push(leftIdx);
        }
        if (rightIdx < length) {
          activePointers.RIGHT = rightIdx;
          secondaryList.push(rightIdx);
        }

        pushFrame(
          `Find Smallest among Node #${index} and Children`,
          34,
          `Node #${index} (${heap[index]}): left child #${leftIdx} (${
            leftIdx < length ? heap[leftIdx] : "none"
          }), right child #${rightIdx} (${
            rightIdx < length ? heap[rightIdx] : "none"
          }).`,
          index,
          activePointers,
          {
            operation: "_heapifyDown()",
            index,
            leftChild: leftIdx < length ? `${leftIdx} (val: ${heap[leftIdx]})` : "none",
            rightChild: rightIdx < length ? `${rightIdx} (val: ${heap[rightIdx]})` : "none",
          },
          secondaryList,
        );

        if (leftIdx < length && heap[leftIdx] < heap[smallestIdx]) {
          smallestIdx = leftIdx;
          pushFrame(
            `Left Child < Current`,
            36,
            `heap[left=${leftIdx}] (${heap[leftIdx]}) < heap[smallest=${index}] (${heap[index]}). Smallest is now left child (#${leftIdx}).`,
            index,
            { ...activePointers, SMALLEST: smallestIdx },
            {
              operation: "_heapifyDown()",
              smallestIndex: smallestIdx,
            },
            secondaryList,
            [smallestIdx],
          );
        }

        if (rightIdx < length && heap[rightIdx] < heap[smallestIdx]) {
          smallestIdx = rightIdx;
          pushFrame(
            `Right Child < Smallest`,
            39,
            `heap[right=${rightIdx}] (${heap[rightIdx]}) < current smallest (${heap[smallestIdx]}). Smallest is now right child (#${rightIdx}).`,
            index,
            { ...activePointers, SMALLEST: smallestIdx },
            {
              operation: "_heapifyDown()",
              smallestIndex: smallestIdx,
            },
            secondaryList,
            [smallestIdx],
          );
        }

        if (smallestIdx === index) {
          pushFrame(
            `Min-Heap Restored`,
            41,
            `smallestIdx (${smallestIdx}) === index (${index}). Root is smaller than both children. Sift down complete!`,
            index,
            { CURR: index },
            {
              operation: "_heapifyDown()",
              index,
              status: "Restored",
            },
            [],
            [],
            [index],
          );
          break;
        }

        // Swap with smallest child
        pushFrame(
          `Swap #${index} <-> #${smallestIdx}`,
          43,
          `Swap Node #${index} (${heap[index]}) with smaller child #${smallestIdx} (${heap[smallestIdx]}).`,
          index,
          { SWAP_FROM: index, SWAP_TO: smallestIdx },
          {
            operation: "_heapifyDown()",
            index,
            smallestIndex: smallestIdx,
          },
          [],
          [index, smallestIdx],
        );

        const temp = heap[index];
        heap[index] = heap[smallestIdx];
        heap[smallestIdx] = temp;
        index = smallestIdx;

        pushFrame(
          `Swapped -> index = ${index}`,
          44,
          `Swapped! index updated to #${index}. Continue sifting down if needed.`,
          index,
          { CURR: index },
          { operation: "_heapifyDown()", index },
          [],
          [],
          [index],
        );
      }

      callStack.pop(); // pop _heapifyDown

      pushFrame(
        `poll() Complete`,
        15,
        `Extracted minimum ${rootVal}. Heap restored with ${heap.length} elements remaining.`,
        null,
        {},
        { operation: "poll()", returned: rootVal, heapSize: heap.length },
      );

      callStack.pop(); // pop poll
    }
  }

  pushFrame(
    "Finished",
    46,
    `All operations completed! Final heap size: ${heap.length}, Min element: ${
      heap.length > 0 ? heap[0] : "empty"
    }.`,
    null,
    {},
    {
      finalSize: heap.length,
      minElement: heap.length > 0 ? heap[0] : "empty",
      finalHeap: `[${heap.join(", ")}]`,
    },
  );

  return builder.getFrames();
}

export default generateFrames;
