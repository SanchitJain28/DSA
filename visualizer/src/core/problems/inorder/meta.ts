import type { ProblemMeta } from "../../shared/types";

export interface InorderData {
  values: (number | null)[];
}

export const meta: ProblemMeta<InorderData> = {
  id: "inorder",
  title: "Binary Tree Inorder Traversal",
  difficulty: "Easy",
  category: "Trees & BST",
  topicId: "trees",
  theme: "emerald",
  description:
    "Visit binary tree nodes in Left -> Root -> Right order producing sorted order for Binary Search Trees.",
  tags: ["DFS", "Binary Tree", "Inorder", "BST"],
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
      name: "Standard BST: [4, 2, 7, 1, 3, 6, 9]",
      preview: "Nodes: [4, 2, 7, 1, 3, 6, 9]",
      data: { values: [4, 2, 7, 1, 3, 6, 9] },
    },
    {
      id: "tc2",
      name: "Skewed Right: [1, null, 2, null, 3]",
      preview: "Nodes: [1, null, 2, null, 3]",
      data: { values: [1, null, 2, null, 3] },
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
