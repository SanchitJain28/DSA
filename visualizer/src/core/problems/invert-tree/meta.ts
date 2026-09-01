import type { ProblemMeta } from "../../shared/types";

export interface InvertTreeData {
  values: (number | null)[];
}

export const meta: ProblemMeta<InvertTreeData> = {
  id: "invert",
  title: "Invert Binary Tree",
  difficulty: "Easy",
  category: "Trees & BST",
  topicId: "trees",
  theme: "emerald",
  description:
    "Invert a binary tree by recursively swapping the left and right child subtrees of every node.",
  tags: ["DFS", "Binary Tree", "Recursion", "Mirror"],
  structures: ["tree"],
  inputSchema: [
    {
      key: "values",
      label: "Tree Nodes (Level-Order BFS Array)",
      type: "array",
      placeholder: "[4, 2, 7, 1, 3, 6, 9]",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Standard: [4, 2, 7, 1, 3, 6, 9]",
      preview: "Nodes: [4, 2, 7, 1, 3, 6, 9]",
      data: { values: [4, 2, 7, 1, 3, 6, 9] },
    },
    {
      id: "tc2",
      name: "Small: [2, 1, 3]",
      preview: "Nodes: [2, 1, 3]",
      data: { values: [2, 1, 3] },
    },
    {
      id: "tc3",
      name: "Single Node: [1]",
      preview: "Nodes: [1]",
      data: { values: [1] },
    },
  ],
};

export default meta;
