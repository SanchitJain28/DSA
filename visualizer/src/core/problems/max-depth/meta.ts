import type { ProblemMeta } from "../../shared/types";

export interface MaxDepthData {
  values: (number | null)[];
}

export const meta: ProblemMeta<MaxDepthData> = {
  id: "maxdepth",
  title: "Maximum Depth of Binary Tree",
  difficulty: "Easy",
  category: "Trees & BST",
  topicId: "trees",
  theme: "emerald",
  description:
    "Find the maximum depth (height) of a binary tree by calculating 1 + max(leftDepth, rightDepth) recursively.",
  tags: ["DFS", "Binary Tree", "Recursion", "Tree Height"],
  structures: ["tree"],
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
      preview: "Nodes: [3, 9, 20, null, null, 15, 7]",
      data: { values: [3, 9, 20, null, null, 15, 7] },
    },
    {
      id: "tc2",
      name: "Skewed: [1, null, 2, null, 3, null, 4]",
      preview: "Nodes: [1, null, 2, null, 3, null, 4]",
      data: { values: [1, null, 2, null, 3, null, 4] },
    },
    {
      id: "tc3",
      name: "Single Node: [1]",
      preview: "Nodes: [1]",
      data: { values: [1] },
    },
    {
      id: "tc4",
      name: "Empty Tree: []",
      preview: "Nodes: []",
      data: { values: [] },
    },
  ],
};

export default meta;
