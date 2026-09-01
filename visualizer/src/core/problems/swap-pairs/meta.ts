import type { ProblemMeta } from "../../shared/types";

export interface SwapPairsData {
  values: number[];
}

export const meta: ProblemMeta<SwapPairsData> = {
  id: "swappairs",
  title: "Swap Nodes in Pairs",
  difficulty: "Medium",
  category: "Linked List",
  topicId: "linked-list",
  theme: "indigo",
  description:
    "Swap every two adjacent nodes in a linked list and return its head without modifying node values.",
  tags: ["Linked List", "Recursion", "Pointer Manipulation"],
  structures: ["linkedList"],
  inputSchema: [
    {
      key: "values",
      label: "Node Values (comma-separated)",
      type: "array",
      placeholder: "[1, 2, 3, 4]",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Even Length: [1, 2, 3, 4]",
      preview: "Nodes: [1, 2, 3, 4]",
      data: { values: [1, 2, 3, 4] },
    },
    {
      id: "tc2",
      name: "Odd Length: [1, 2, 3, 4, 5]",
      preview: "Nodes: [1, 2, 3, 4, 5]",
      data: { values: [1, 2, 3, 4, 5] },
    },
    {
      id: "tc3",
      name: "Single Node: [1]",
      preview: "Nodes: [1]",
      data: { values: [1] },
    },
    {
      id: "tc4",
      name: "Two Nodes: [1, 2]",
      preview: "Nodes: [1, 2]",
      data: { values: [1, 2] },
    },
  ],
};

export default meta;
