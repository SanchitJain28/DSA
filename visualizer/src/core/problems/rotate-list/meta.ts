import type { ProblemMeta } from "../../shared/types";

export interface RotateListData {
  values: number[];
  k: number;
}

export const meta: ProblemMeta<RotateListData> = {
  id: "rotatelist",
  title: "Rotate List",
  difficulty: "Medium",
  category: "Linked List",
  topicId: "linked-list",
  theme: "indigo",
  description:
    "Rotate the linked list to the right by k places by connecting the tail to head and severing at (length - k % length).",
  tags: ["Linked List", "Two Pointers", "Circular List"],
  structures: ["linkedList"],
  inputSchema: [
    {
      key: "values",
      label: "Node Values (comma-separated)",
      type: "array",
      placeholder: "[1, 2, 3, 4, 5]",
    },
    {
      key: "k",
      label: "Rotate Steps (k)",
      type: "number",
      placeholder: "2",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Rotate by 2: [1, 2, 3, 4, 5] (k = 2)",
      preview: "Nodes: [1, 2, 3, 4, 5], k: 2",
      data: { values: [1, 2, 3, 4, 5], k: 2 },
    },
    {
      id: "tc2",
      name: "Rotate by 4: [0, 1, 2] (k = 4)",
      preview: "Nodes: [0, 1, 2], k: 4",
      data: { values: [0, 1, 2], k: 4 },
    },
    {
      id: "tc3",
      name: "No Rotation: [1, 2, 3] (k = 0)",
      preview: "Nodes: [1, 2, 3], k: 0",
      data: { values: [1, 2, 3], k: 0 },
    },
    {
      id: "tc4",
      name: "Full Circle: [1, 2] (k = 2)",
      preview: "Nodes: [1, 2], k: 2",
      data: { values: [1, 2], k: 2 },
    },
  ],
};

export default meta;
