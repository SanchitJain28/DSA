import type { ProblemMeta } from "../../shared/types";

export interface ReorderListData {
  values: number[];
}

export const meta: ProblemMeta<ReorderListData> = {
  id: "reorderlist",
  title: "Reorder List",
  difficulty: "Medium",
  category: "Linked List",
  topicId: "linked-list",
  theme: "indigo",
  description:
    "Reorder the list to L0 → Ln → L1 → Ln-1 → L2 → Ln-2 by finding the middle, reversing the second half, and merging both halves.",
  tags: ["Linked List", "Two Pointers", "Reversal", "Merge"],
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
      name: "Even Length: [1, 2, 3, 4]",
      preview: "Nodes: [1, 2, 3, 4]",
      data: { values: [1, 2, 3, 4] },
    },
    {
      id: "tc3",
      name: "Two Nodes: [1, 2]",
      preview: "Nodes: [1, 2]",
      data: { values: [1, 2] },
    },
    {
      id: "tc4",
      name: "Single Node: [1]",
      preview: "Nodes: [1]",
      data: { values: [1] },
    },
  ],
};

export default meta;
