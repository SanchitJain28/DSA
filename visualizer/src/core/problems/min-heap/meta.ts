import type { ProblemMeta } from "../../shared/types";

export interface MinHeapData {
  actions: string; // e.g. "add:5, add:3, add:17, add:10, poll, add:6, poll"
}

export const meta: ProblemMeta<MinHeapData> = {
  id: "minheap",
  title: "Min Heap (Heapify Up & Down)",
  difficulty: "Medium",
  category: "Heap / Priority Queue",
  topicId: "heap",
  theme: "emerald",
  description:
    "Complete binary min-heap implementation visualizing _heapifyUp() on insertion and _heapifyDown() on root extraction across both binary tree and 0-indexed array representations.",
  tags: [
    "Min Heap",
    "Binary Heap",
    "Heapify Up",
    "Heapify Down",
    "Priority Queue",
    "Complete Binary Tree",
  ],
  structures: ["tree", "arrays"],
  inputSchema: [
    {
      key: "actions",
      label: "Heap Operations (comma-separated: add:X, poll, peek)",
      type: "string",
      placeholder: "add:5, add:3, add:17, add:10, add:84, add:19, add:6, poll, poll",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Insertions & Bubble Up: [5, 3, 17, 10, 84, 19, 6, 22, 9]",
      preview: "add:5, add:3, add:17, add:10, add:84, add:19, add:6, add:22, add:9",
      data: {
        actions: "add:5, add:3, add:17, add:10, add:84, add:19, add:6, add:22, add:9",
      },
    },
    {
      id: "tc2",
      name: "Poll & Sift Down: [4, 10, 3, 5, 1] then 2x poll()",
      preview: "add:4, add:10, add:3, add:5, add:1, poll, poll",
      data: {
        actions: "add:4, add:10, add:3, add:5, add:1, poll, poll",
      },
    },
    {
      id: "tc3",
      name: "Reverse Sorted Stream: [90, 80, 70, 60, 50, 40, 30]",
      preview: "add:90, add:80, add:70, add:60, add:50, add:40, add:30",
      data: {
        actions: "add:90, add:80, add:70, add:60, add:50, add:40, add:30",
      },
    },
    {
      id: "tc4",
      name: "Priority Queue Mix: [25, 15, 35, 5] -> poll() -> add:2 -> poll()",
      preview: "add:25, add:15, add:35, add:5, poll, add:2, poll",
      data: {
        actions: "add:25, add:15, add:35, add:5, poll, add:2, poll",
      },
    },
  ],
};

export default meta;
