import type { ProblemMeta } from "../../shared/types";

export interface ZigzagData {
  values: (number | null)[];
}

export const meta: ProblemMeta<ZigzagData> = {
  id: "zigzaglevelorder",
  title: "Binary Tree Zigzag Level Order Traversal",
  difficulty: "Medium",
  category: "Trees & BST",
  topicId: "trees",
  theme: "emerald",
  description:
    "Traverse binary tree levels alternating directions (left-to-right on even levels, right-to-left on odd levels).",
  tags: ["BFS", "Binary Tree", "Queue", "Zigzag", "Level Order"],
  structures: ["tree", "queue"],
  inputSchema: [
    {
      key: "values",
      label: "Tree Nodes (Level-Order BFS Array)",
      type: "array",
      placeholder: "[3, 9, 20, null, null, 15, 7]",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Standard: [3, 9, 20, null, null, 15, 7]",
      preview: "[[3], [20, 9], [15, 7]]",
      data: { values: [3, 9, 20, null, null, 15, 7] },
    },
    {
      id: "tc2",
      name: "Single Node: [1]",
      preview: "[[1]]",
      data: { values: [1] },
    },
  ],
};

export default meta;
