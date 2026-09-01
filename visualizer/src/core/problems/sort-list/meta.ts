import type { ProblemMeta } from "../../shared/types";

export interface SortListData {
  values: number[];
}

export const meta: ProblemMeta<SortListData> = {
  id: "sortlist",
  title: "Sort List",
  difficulty: "Medium",
  category: "Linked List",
  topicId: "linked-list",
  theme: "indigo",
  description:
    "Sort a linked list in O(n log n) time using top-down Merge Sort with divide-and-conquer recursion.",
  tags: ["Linked List", "Merge Sort", "Divide and Conquer", "Recursion"],
  structures: ["linkedList"],
  inputSchema: [
    {
      key: "values",
      label: "Node Values (comma-separated)",
      type: "array",
      placeholder: "[4, 2, 1, 3]",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Standard: [4, 2, 1, 3]",
      preview: "Nodes: [4, 2, 1, 3]",
      data: { values: [4, 2, 1, 3] },
    },
    {
      id: "tc2",
      name: "Negatives: [-1, 5, 3, 4, 0]",
      preview: "Nodes: [-1, 5, 3, 4, 0]",
      data: { values: [-1, 5, 3, 4, 0] },
    },
    {
      id: "tc3",
      name: "Already Sorted: [1, 2, 3, 4]",
      preview: "Nodes: [1, 2, 3, 4]",
      data: { values: [1, 2, 3, 4] },
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
