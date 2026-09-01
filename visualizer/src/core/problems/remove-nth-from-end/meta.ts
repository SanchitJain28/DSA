import type { ProblemMeta } from "../../shared/types";

export interface RemoveNthFromEndData {
  values: number[];
  n: number;
}

export const meta: ProblemMeta<RemoveNthFromEndData> = {
  id: "removenthfromend",
  title: "Remove Nth Node From End of List",
  difficulty: "Medium",
  category: "Linked List",
  topicId: "linked-list",
  theme: "indigo",
  description:
    "Remove the n-th node from the end of the list and return its head using a one-pass two-pointer approach with a dummy node.",
  tags: ["Linked List", "Two Pointers", "Dummy Node"],
  structures: ["linkedList"],
  inputSchema: [
    {
      key: "values",
      label: "Node Values (comma-separated)",
      type: "array",
      placeholder: "[1, 2, 3, 4, 5]",
    },
    {
      key: "n",
      label: "Nth from End (n)",
      type: "number",
      placeholder: "2",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Standard: [1, 2, 3, 4, 5] (n = 2)",
      preview: "Nodes: [1, 2, 3, 4, 5], n: 2",
      data: { values: [1, 2, 3, 4, 5], n: 2 },
    },
    {
      id: "tc2",
      name: "Remove Head (Single Node): [1] (n = 1)",
      preview: "Nodes: [1], n: 1",
      data: { values: [1], n: 1 },
    },
    {
      id: "tc3",
      name: "Remove Head (Multiple Nodes): [1, 2] (n = 2)",
      preview: "Nodes: [1, 2], n: 2",
      data: { values: [1, 2], n: 2 },
    },
    {
      id: "tc4",
      name: "Remove Tail: [1, 2, 3] (n = 1)",
      preview: "Nodes: [1, 2, 3], n: 1",
      data: { values: [1, 2, 3], n: 1 },
    },
  ],
};

export default meta;
