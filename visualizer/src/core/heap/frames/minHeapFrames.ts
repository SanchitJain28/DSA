import { FrameBuilder } from "../../shared/FrameBuilder";
import type { HeapFrame, HeapTreeLayout, HeapNode, HeapEdge } from "../types";
import type { ArrayData } from "../../array/types";

export function computeHeapLayout(heap: number[]): HeapTreeLayout {
  const n = heap.length;
  if (n === 0) {
    return { nodes: [], edges: [], width: 500, height: 200 };
  }

  const maxLevel = Math.floor(Math.log2(n));
  const baseSpacing = 50;
  const leafCount = Math.pow(2, maxLevel);
  const totalWidth = Math.max(540, leafCount * baseSpacing * 1.6);
  const levelHeight = 68;

  const nodes: HeapNode[] = [];
  const edges: HeapEdge[] = [];

  for (let i = 0; i < n; i++) {
    const level = Math.floor(Math.log2(i + 1));
    const countAtLevel = Math.pow(2, level);
    const posInLevel = i - (countAtLevel - 1);
    const slotWidth = totalWidth / countAtLevel;
    const x = slotWidth * (posInLevel + 0.5);
    const y = 36 + level * levelHeight;

    nodes.push({
      id: `heap-node-${i}`,
      value: heap[i],
      index: i,
      x,
      y,
      level,
    });

    if (i > 0) {
      const parentIndex = Math.floor((i - 1) / 2);
      edges.push({
        id: `heap-edge-${parentIndex}-${i}`,
        from: `heap-node-${parentIndex}`,
        to: `heap-node-${i}`,
        fromIndex: parentIndex,
        toIndex: i,
      });
    }
  }

  return {
    nodes,
    edges,
    width: totalWidth,
    height: (maxLevel + 1) * levelHeight + 60,
  };
}

export type HeapAction =
  | { type: "add"; value: number }
  | { type: "poll" }
  | { type: "peek" };

export function generateFrames(actions: HeapAction[]): HeapFrame[] {
  const builder = new FrameBuilder<HeapFrame>();
  const heap: number[] = [];

  const getEmptyVars = () => ({
    operation: "Idle",
    size: String(heap.length),
    index: "—",
    parentIndex: "—",
    leftChild: "—",
    rightChild: "—",
    smallest: "—",
    comparison: "—",
  });

  const makeArrays = (
    pointers: Record<string, number> = {}
  ): ArrayData[] => {
    return [
      {
        id: "heap-array",
        name: "Heap Array Representation (heap[0 .. n-1])",
        values: [...heap],
        pointers: Object.keys(pointers).length > 0 ? { ...pointers } : undefined,
      },
    ];
  };

  // Initial Empty Frame
  builder.pushFrame({
    phase: "Initialization",
    codeLine: 1,
    message: "Initialized empty MinHeap. Ready to process operations.",
    variables: getEmptyVars(),
    heap: [...heap],
    operation: "idle",
    layout: computeHeapLayout(heap),
    arrays: makeArrays(),
    activeIndices: [],
  });

  for (const action of actions) {
    if (action.type === "add") {
      const value = action.value;

      // 1. push value to end of heap
      heap.push(value);
      const insertedIdx = heap.length - 1;

      builder.pushFrame({
        phase: `add(${value}) -> Insert at end`,
        codeLine: 5,
        message: `this.heap.push(${value}): Append ${value} to end of array at index ${insertedIdx}.`,
        variables: {
          ...getEmptyVars(),
          operation: `add(${value})`,
          size: String(heap.length),
          index: `${insertedIdx} (val: ${value})`,
        },
        heap: [...heap],
        operation: "add",
        opValue: value,
        currentIndex: insertedIdx,
        activeIndices: [insertedIdx],
        layout: computeHeapLayout(heap),
        arrays: makeArrays({ INSERT: insertedIdx }),
      });

      // 2. Call _heapifyUp
      builder.pushFrame({
        phase: `_heapifyUp() -> Restore Min-Heap`,
        codeLine: 6,
        message: `Call _heapifyUp() to bubble up ${value} until parent <= child.`,
        variables: {
          ...getEmptyVars(),
          operation: `_heapifyUp()`,
          size: String(heap.length),
          index: `${insertedIdx} (val: ${value})`,
        },
        heap: [...heap],
        operation: "add",
        opValue: value,
        currentIndex: insertedIdx,
        activeIndices: [insertedIdx],
        layout: computeHeapLayout(heap),
        arrays: makeArrays({ CURR: insertedIdx }),
      });

      // 3. _heapifyUp execution
      let index = insertedIdx;
      builder.pushFrame({
        phase: `_heapifyUp: index = ${index}`,
        codeLine: 19,
        message: `Set index = ${index}.`,
        variables: {
          ...getEmptyVars(),
          operation: "_heapifyUp",
          size: String(heap.length),
          index: `${index} (val: ${heap[index]})`,
        },
        heap: [...heap],
        operation: "add",
        opValue: value,
        currentIndex: index,
        activeIndices: [index],
        layout: computeHeapLayout(heap),
        arrays: makeArrays({ CURR: index }),
      });

      while (index > 0) {
        const parentIndex = Math.floor((index - 1) / 2);

        builder.pushFrame({
          phase: `Compare with Parent #${parentIndex}`,
          codeLine: 21,
          message: `parentIndex = ⌊(${index} - 1) / 2⌋ = ${parentIndex}. Compare parent heap[${parentIndex}] (${heap[parentIndex]}) vs child heap[${index}] (${heap[index]}).`,
          variables: {
            ...getEmptyVars(),
            operation: "_heapifyUp",
            size: String(heap.length),
            index: `${index} (val: ${heap[index]})`,
            parentIndex: `${parentIndex} (val: ${heap[parentIndex]})`,
            comparison: `${heap[parentIndex]} <= ${heap[index]} ?`,
          },
          heap: [...heap],
          operation: "add",
          opValue: value,
          currentIndex: index,
          parentIndex,
          compareIndices: [parentIndex, index],
          activeIndices: [parentIndex, index],
          layout: computeHeapLayout(heap),
          arrays: makeArrays({ PARENT: parentIndex, CURR: index }),
        });

        if (heap[parentIndex] <= heap[index]) {
          builder.pushFrame({
            phase: `Min-Heap Property Valid`,
            codeLine: 22,
            message: `heap[${parentIndex}] (${heap[parentIndex]}) <= heap[${index}] (${heap[index]}). Min-heap property holds. Bubble up complete!`,
            variables: {
              ...getEmptyVars(),
              operation: "_heapifyUp",
              size: String(heap.length),
              index: `${index} (val: ${heap[index]})`,
              parentIndex: `${parentIndex} (val: ${heap[parentIndex]})`,
              comparison: `Valid (${heap[parentIndex]} <= ${heap[index]})`,
            },
            heap: [...heap],
            operation: "add",
            opValue: value,
            currentIndex: index,
            parentIndex,
            activeIndices: [index],
            layout: computeHeapLayout(heap),
            arrays: makeArrays({ CURR: index }),
          });
          break;
        }

        // Swap parent and child
        builder.pushFrame({
          phase: `Swap #${parentIndex} ↔ #${index}`,
          codeLine: 23,
          message: `heap[${parentIndex}] (${heap[parentIndex]}) > heap[${index}] (${heap[index]}). Violation! Swap parent and child.`,
          variables: {
            ...getEmptyVars(),
            operation: "_heapifyUp",
            size: String(heap.length),
            index: `${index} (val: ${heap[index]})`,
            parentIndex: `${parentIndex} (val: ${heap[parentIndex]})`,
            comparison: `Violated (${heap[parentIndex]} > ${heap[index]})`,
          },
          heap: [...heap],
          operation: "add",
          opValue: value,
          currentIndex: index,
          parentIndex,
          swapIndices: [parentIndex, index],
          activeIndices: [parentIndex, index],
          layout: computeHeapLayout(heap),
          arrays: makeArrays({ SWAP: parentIndex, CURR: index }),
        });

        // Perform swap
        const temp = heap[parentIndex];
        heap[parentIndex] = heap[index];
        heap[index] = temp;
        index = parentIndex;

        builder.pushFrame({
          phase: `Moved up to index ${index}`,
          codeLine: 24,
          message: `Swapped! New parent value is ${heap[parentIndex]}. Update index = parentIndex = ${index}.`,
          variables: {
            ...getEmptyVars(),
            operation: "_heapifyUp",
            size: String(heap.length),
            index: `${index} (val: ${heap[index]})`,
          },
          heap: [...heap],
          operation: "add",
          opValue: value,
          currentIndex: index,
          activeIndices: [index],
          layout: computeHeapLayout(heap),
          arrays: makeArrays({ CURR: index }),
        });
      }

      builder.pushFrame({
        phase: `add(${value}) Finished`,
        codeLine: 7,
        message: `add(${value}) completed. Min-heap is valid.`,
        variables: {
          ...getEmptyVars(),
          operation: "Ready",
          size: String(heap.length),
        },
        heap: [...heap],
        operation: "idle",
        layout: computeHeapLayout(heap),
        arrays: makeArrays(),
        activeIndices: [],
      });
    } else if (action.type === "poll") {
      if (heap.length === 0) {
        builder.pushFrame({
          phase: "poll() -> Heap Empty",
          codeLine: 10,
          message: "heap is empty. Returning null.",
          variables: {
            ...getEmptyVars(),
            operation: "poll()",
            comparison: "null",
          },
          heap: [...heap],
          operation: "poll",
          layout: computeHeapLayout(heap),
          arrays: makeArrays(),
          activeIndices: [],
        });
        continue;
      }

      if (heap.length === 1) {
        const popped = heap.pop()!;
        builder.pushFrame({
          phase: `poll() -> Return Single Node ${popped}`,
          codeLine: 11,
          message: `Single element heap. Pop and return ${popped}.`,
          variables: {
            ...getEmptyVars(),
            operation: "poll()",
            comparison: `Returned ${popped}`,
            size: "0",
          },
          heap: [...heap],
          operation: "poll",
          layout: computeHeapLayout(heap),
          arrays: makeArrays(),
          activeIndices: [],
        });
        continue;
      }

      const root = heap[0];

      // Save root
      builder.pushFrame({
        phase: `poll() -> Extract Root (${root})`,
        codeLine: 12,
        message: `Extract root element: const root = heap[0] = ${root}.`,
        variables: {
          ...getEmptyVars(),
          operation: "poll()",
          size: String(heap.length),
          index: `0 (Root: ${root})`,
        },
        heap: [...heap],
        operation: "poll",
        currentIndex: 0,
        activeIndices: [0],
        layout: computeHeapLayout(heap),
        arrays: makeArrays({ ROOT: 0 }),
      });

      // Move last element to root
      const lastElem = heap.pop()!;
      heap[0] = lastElem;

      builder.pushFrame({
        phase: `Move Last Element (${lastElem}) to Root`,
        codeLine: 13,
        message: `heap[0] = heap.pop() (${lastElem}): Overwrite root with the last leaf element.`,
        variables: {
          ...getEmptyVars(),
          operation: "poll()",
          size: String(heap.length),
          index: `0 (New Root: ${lastElem})`,
        },
        heap: [...heap],
        operation: "poll",
        currentIndex: 0,
        activeIndices: [0],
        layout: computeHeapLayout(heap),
        arrays: makeArrays({ ROOT: 0 }),
      });

      // Call _heapifyDown
      builder.pushFrame({
        phase: `_heapifyDown() -> Restore Min-Heap`,
        codeLine: 14,
        message: `Call _heapifyDown() to bubble down ${lastElem} to its correct position.`,
        variables: {
          ...getEmptyVars(),
          operation: "_heapifyDown()",
          size: String(heap.length),
          index: "0",
        },
        heap: [...heap],
        operation: "poll",
        currentIndex: 0,
        activeIndices: [0],
        layout: computeHeapLayout(heap),
        arrays: makeArrays({ CURR: 0 }),
      });

      let index = 0;
      const length = heap.length;

      while (true) {
        const leftChildIndex = 2 * index + 1;
        const rightChildIndex = 2 * index + 2;
        let smallestIndex = index;

        builder.pushFrame({
          phase: `_heapifyDown: Inspect Node #${index}`,
          codeLine: 34,
          message: `Inspecting node at index ${index} (val: ${heap[index]}). leftChild = ${leftChildIndex < length ? `${leftChildIndex} (${heap[leftChildIndex]})` : "None"}, rightChild = ${rightChildIndex < length ? `${rightChildIndex} (${heap[rightChildIndex]})` : "None"}.`,
          variables: {
            ...getEmptyVars(),
            operation: "_heapifyDown",
            size: String(heap.length),
            index: `${index} (val: ${heap[index]})`,
            leftChild: leftChildIndex < length ? `${leftChildIndex} (val: ${heap[leftChildIndex]})` : "None",
            rightChild: rightChildIndex < length ? `${rightChildIndex} (val: ${heap[rightChildIndex]})` : "None",
            smallest: `${smallestIndex} (val: ${heap[smallestIndex]})`,
          },
          heap: [...heap],
          operation: "poll",
          currentIndex: index,
          leftChildIndex: leftChildIndex < length ? leftChildIndex : null,
          rightChildIndex: rightChildIndex < length ? rightChildIndex : null,
          smallestIndex,
          activeIndices: [index],
          layout: computeHeapLayout(heap),
          arrays: makeArrays({
            CURR: index,
            ...(leftChildIndex < length ? { L: leftChildIndex } : {}),
            ...(rightChildIndex < length ? { R: rightChildIndex } : {}),
          }),
        });

        // Check left child
        if (leftChildIndex < length && heap[leftChildIndex] < heap[smallestIndex]) {
          smallestIndex = leftChildIndex;
          builder.pushFrame({
            phase: `Left Child #${leftChildIndex} is smaller`,
            codeLine: 36,
            message: `Left child heap[${leftChildIndex}] (${heap[leftChildIndex]}) < current smallest (${heap[index]}). Update smallestIndex = ${smallestIndex}.`,
            variables: {
              ...getEmptyVars(),
              operation: "_heapifyDown",
              size: String(heap.length),
              index: `${index} (val: ${heap[index]})`,
              leftChild: `${leftChildIndex} (val: ${heap[leftChildIndex]})`,
              rightChild: rightChildIndex < length ? `${rightChildIndex} (val: ${heap[rightChildIndex]})` : "None",
              smallest: `${smallestIndex} (val: ${heap[smallestIndex]})`,
              comparison: `Left < Parent (${heap[leftChildIndex]} < ${heap[index]})`,
            },
            heap: [...heap],
            operation: "poll",
            currentIndex: index,
            leftChildIndex,
            rightChildIndex: rightChildIndex < length ? rightChildIndex : null,
            smallestIndex,
            activeIndices: [index, leftChildIndex],
            layout: computeHeapLayout(heap),
            arrays: makeArrays({
              CURR: index,
              SMALLEST: smallestIndex,
              ...(rightChildIndex < length ? { R: rightChildIndex } : {}),
            }),
          });
        }

        // Check right child
        if (rightChildIndex < length && heap[rightChildIndex] < heap[smallestIndex]) {
          smallestIndex = rightChildIndex;
          builder.pushFrame({
            phase: `Right Child #${rightChildIndex} is smallest`,
            codeLine: 39,
            message: `Right child heap[${rightChildIndex}] (${heap[rightChildIndex]}) < current smallest (${heap[smallestIndex === leftChildIndex ? leftChildIndex : index]}). Update smallestIndex = ${smallestIndex}.`,
            variables: {
              ...getEmptyVars(),
              operation: "_heapifyDown",
              size: String(heap.length),
              index: `${index} (val: ${heap[index]})`,
              leftChild: leftChildIndex < length ? `${leftChildIndex} (val: ${heap[leftChildIndex]})` : "None",
              rightChild: `${rightChildIndex} (val: ${heap[rightChildIndex]})`,
              smallest: `${smallestIndex} (val: ${heap[smallestIndex]})`,
              comparison: `Right is smallest (${heap[rightChildIndex]})`,
            },
            heap: [...heap],
            operation: "poll",
            currentIndex: index,
            leftChildIndex: leftChildIndex < length ? leftChildIndex : null,
            rightChildIndex,
            smallestIndex,
            activeIndices: [index, rightChildIndex],
            layout: computeHeapLayout(heap),
            arrays: makeArrays({
              CURR: index,
              ...(leftChildIndex < length ? { L: leftChildIndex } : {}),
              SMALLEST: smallestIndex,
            }),
          });
        }

        // If smallest is index, we are done
        if (smallestIndex === index) {
          builder.pushFrame({
            phase: `Min-Heap Restored at Index ${index}`,
            codeLine: 41,
            message: `smallestIndex === index (${index}). Node is smaller than or equal to both its children. Heapify down complete!`,
            variables: {
              ...getEmptyVars(),
              operation: "_heapifyDown",
              size: String(heap.length),
              index: `${index} (val: ${heap[index]})`,
              smallest: `${index}`,
              comparison: "Done",
            },
            heap: [...heap],
            operation: "poll",
            currentIndex: index,
            activeIndices: [index],
            layout: computeHeapLayout(heap),
            arrays: makeArrays({ CURR: index }),
          });
          break;
        }

        // Swap parent with smallest child
        builder.pushFrame({
          phase: `Swap #${index} ↔ #${smallestIndex}`,
          codeLine: 42,
          message: `Swap parent heap[${index}] (${heap[index]}) with smallest child heap[${smallestIndex}] (${heap[smallestIndex]}).`,
          variables: {
            ...getEmptyVars(),
            operation: "_heapifyDown",
            size: String(heap.length),
            index: `${index} (val: ${heap[index]})`,
            smallest: `${smallestIndex} (val: ${heap[smallestIndex]})`,
            comparison: `Swap (${heap[index]} ↔ ${heap[smallestIndex]})`,
          },
          heap: [...heap],
          operation: "poll",
          currentIndex: index,
          smallestIndex,
          swapIndices: [index, smallestIndex],
          activeIndices: [index, smallestIndex],
          layout: computeHeapLayout(heap),
          arrays: makeArrays({ SWAP1: index, SWAP2: smallestIndex }),
        });

        const temp = heap[index];
        heap[index] = heap[smallestIndex];
        heap[smallestIndex] = temp;
        index = smallestIndex;

        builder.pushFrame({
          phase: `Shift Down -> Index ${index}`,
          codeLine: 43,
          message: `Swapped! Set index = smallestIndex = ${index}. Continue bubble down if needed.`,
          variables: {
            ...getEmptyVars(),
            operation: "_heapifyDown",
            size: String(heap.length),
            index: `${index} (val: ${heap[index]})`,
          },
          heap: [...heap],
          operation: "poll",
          currentIndex: index,
          activeIndices: [index],
          layout: computeHeapLayout(heap),
          arrays: makeArrays({ CURR: index }),
        });
      }

      builder.pushFrame({
        phase: `poll() Returned ${root}`,
        codeLine: 15,
        message: `poll() finished successfully. Extracted minimum value was ${root}.`,
        variables: {
          ...getEmptyVars(),
          operation: "Ready",
          size: String(heap.length),
          comparison: `Extracted ${root}`,
        },
        heap: [...heap],
        operation: "idle",
        layout: computeHeapLayout(heap),
        arrays: makeArrays(),
        activeIndices: [],
      });
    }
  }

  return builder.getFrames();
}
