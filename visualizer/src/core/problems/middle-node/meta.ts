import type { ProblemMeta } from "../../shared/types";

export interface MiddleNodeData {
  values: number[];
}

export const meta: ProblemMeta<MiddleNodeData> = {
  id: "middlenode",
  title: "Middle of the Linked List",
  difficulty: "Easy",
  category: "Linked List",
  topicId: "linked-list",
  theme: "indigo",
  description:
    "Find the middle node of a singly linked list using fast and slow pointers.",
  tags: ["Linked List", "Two Pointers", "Fast & Slow Pointers"],
  structures: ["linkedList"],
  inputSchema: [
    {
      key: "values",
      label: "Node Values (comma-separated)",
      type: "array",
      placeholder: "[1, 2, 3, 4, 5]",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Odd Length: [1, 2, 3, 4, 5]",
      preview: "Nodes: [1, 2, 3, 4, 5]",
      data: { values: [1, 2, 3, 4, 5] },
    },
    {
      id: "tc2",
      name: "Even Length: [1, 2, 3, 4, 5, 6]",
      preview: "Nodes: [1, 2, 3, 4, 5, 6]",
      data: { values: [1, 2, 3, 4, 5, 6] },
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
