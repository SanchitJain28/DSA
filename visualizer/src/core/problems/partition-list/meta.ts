import type { ProblemMeta } from "../../shared/types";

export interface PartitionListData {
  values: number[];
  x: number;
}

export const meta: ProblemMeta<PartitionListData> = {
  id: "partitionlist",
  title: "Partition List",
  difficulty: "Medium",
  category: "Linked List",
  topicId: "linked-list",
  theme: "indigo",
  description:
    "Partition a linked list such that all nodes less than x come before nodes greater than or equal to x, preserving relative order.",
  tags: ["Linked List", "Two Pointers", "Partition"],
  structures: ["linkedList"],
  inputSchema: [
    {
      key: "values",
      label: "Node Values (comma-separated)",
      type: "array",
      placeholder: "[1, 4, 3, 2, 5, 2]",
    },
    {
      key: "x",
      label: "Partition Pivot (x)",
      type: "number",
      placeholder: "3",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Standard: [1, 4, 3, 2, 5, 2] (x = 3)",
      preview: "Nodes: [1, 4, 3, 2, 5, 2], x: 3",
      data: { values: [1, 4, 3, 2, 5, 2], x: 3 },
    },
    {
      id: "tc2",
      name: "Two Elements: [2, 1] (x = 2)",
      preview: "Nodes: [2, 1], x: 2",
      data: { values: [2, 1], x: 2 },
    },
    {
      id: "tc3",
      name: "All Smaller: [1, 2, 3] (x = 5)",
      preview: "Nodes: [1, 2, 3], x: 5",
      data: { values: [1, 2, 3], x: 5 },
    },
    {
      id: "tc4",
      name: "All Greater: [4, 5, 6] (x = 2)",
      preview: "Nodes: [4, 5, 6], x: 2",
      data: { values: [4, 5, 6], x: 2 },
    },
  ],
};

export default meta;
