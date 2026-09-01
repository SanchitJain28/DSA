import type { ProblemMeta } from "../../shared/types";

export interface KthSmallestData {
  values: (number | null)[];
  k: number;
}

export const meta: ProblemMeta<KthSmallestData> = {
  id: "kthsmallest",
  title: "Kth Smallest Element in a BST",
  difficulty: "Medium",
  category: "Trees & BST",
  topicId: "trees",
  theme: "emerald",
  description:
    "Find the kth smallest element (1-indexed) in a Binary Search Tree (BST) using in-order DFS traversal step counting.",
  tags: ["BST", "Binary Search Tree", "DFS", "Inorder Traversal", "Recursion"],
  structures: ["tree"],
  inputSchema: [
    {
      key: "values",
      label: "BST Nodes (Level-Order BFS Array)",
      type: "array",
      placeholder: "[3, 1, 4, null, 2]",
    },
    {
      key: "k",
      label: "K (1-indexed)",
      type: "number",
      placeholder: "1",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "k = 1: [3, 1, 4, null, 2]",
      preview: "k = 1 -> 1",
      data: { values: [3, 1, 4, null, 2], k: 1 },
    },
    {
      id: "tc2",
      name: "k = 3: [5, 3, 6, 2, 4, null, null, 1]",
      preview: "k = 3 -> 3",
      data: { values: [5, 3, 6, 2, 4, null, null, 1], k: 3 },
    },
  ],
};

export default meta;
