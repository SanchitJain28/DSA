import type { ProblemMeta } from "../../shared/types";

export interface LCAData {
  values: (number | null)[];
  p: number;
  q: number;
}

export const meta: ProblemMeta<LCAData> = {
  id: "lca",
  title: "Lowest Common Ancestor of a Binary Search Tree",
  difficulty: "Medium",
  category: "Trees & BST",
  topicId: "trees",
  theme: "emerald",
  description:
    "Find the lowest common ancestor (LCA) node of two given nodes p and q in a Binary Search Tree (BST) using value comparisons.",
  tags: ["BST", "Binary Search Tree", "DFS", "Tree Traversal", "Ancestor"],
  structures: ["tree"],
  inputSchema: [
    {
      key: "values",
      label: "BST Nodes (Level-Order BFS Array)",
      type: "array",
      placeholder: "[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5]",
    },
    {
      key: "p",
      label: "Node P Value",
      type: "number",
      placeholder: "2",
    },
    {
      key: "q",
      label: "Node Q Value",
      type: "number",
      placeholder: "8",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Example 1: p = 2, q = 8 (LCA = 6)",
      preview: "p = 2, q = 8 -> LCA is 6",
      data: {
        values: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5],
        p: 2,
        q: 8,
      },
    },
    {
      id: "tc2",
      name: "Example 2: p = 2, q = 4 (LCA = 2)",
      preview: "p = 2, q = 4 -> LCA is 2",
      data: {
        values: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5],
        p: 2,
        q: 4,
      },
    },
  ],
};

export default meta;
