import type { ProblemMeta } from "../../shared/types";

export interface BalancedTreeData {
  values: (number | null)[];
}

export const meta: ProblemMeta<BalancedTreeData> = {
  id: "balanced",
  title: "Balanced Binary Tree",
  difficulty: "Easy",
  category: "Trees & BST",
  topicId: "trees",
  theme: "emerald",
  description:
    "Determine if a binary tree is height-balanced (depth of the two subtrees of every node never differs by more than 1).",
  tags: ["DFS", "Binary Tree", "Recursion", "Tree Height", "Tree Property"],
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
      name: "Balanced: [3, 9, 20, null, null, 15, 7]",
      preview: "Nodes: [3, 9, 20, null, null, 15, 7]",
      data: { values: [3, 9, 20, null, null, 15, 7] },
    },
    {
      id: "tc2",
      name: "Unbalanced: [1, 2, 2, 3, 3, null, null, 4, 4]",
      preview: "Nodes: [1, 2, 2, 3, 3, null, null, 4, 4]",
      data: { values: [1, 2, 2, 3, 3, null, null, 4, 4] },
    },
    {
      id: "tc3",
      name: "Empty Tree: []",
      preview: "Nodes: []",
      data: { values: [] },
    },
  ],
};

export default meta;
