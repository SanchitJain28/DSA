import type { ProblemMeta } from "../../shared/types";

export interface PreorderData {
  values: (number | null)[];
}

export const meta: ProblemMeta<PreorderData> = {
  id: "preorder",
  title: "Binary Tree Preorder Traversal",
  difficulty: "Easy",
  category: "Trees & BST",
  topicId: "trees",
  theme: "emerald",
  description:
    "Visit binary tree nodes in Root -> Left -> Right order using DFS recursion and call stack unwinding.",
  tags: ["DFS", "Binary Tree", "Recursion", "Preorder"],
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
      name: "Skewed Left: [1, 2, null, 3]",
      preview: "Nodes: [1, 2, null, 3]",
      data: { values: [1, 2, null, 3] },
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
