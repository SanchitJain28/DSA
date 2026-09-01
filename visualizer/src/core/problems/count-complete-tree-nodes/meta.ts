import type { ProblemMeta } from "../../shared/types";

export interface CountNodesData {
  values: (number | null)[];
}

export const meta: ProblemMeta<CountNodesData> = {
  id: "countnodes",
  title: "Count Complete Tree Nodes",
  difficulty: "Medium",
  category: "Trees & BST",
  topicId: "trees",
  theme: "emerald",
  description:
    "Count nodes in a complete binary tree in less than O(n) time by comparing left and right subtree heights.",
  tags: ["DFS", "Binary Tree", "Binary Search", "Tree Height", "Complete Tree"],
  structures: ["tree"],
  inputSchema: [
    {
      key: "values",
      label: "Complete Tree Nodes (Level-Order BFS Array)",
      type: "array",
      placeholder: "[1, 2, 3, 4, 5, 6]",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Complete Tree (6 nodes): [1, 2, 3, 4, 5, 6]",
      preview: "Nodes: [1, 2, 3, 4, 5, 6]",
      data: { values: [1, 2, 3, 4, 5, 6] },
    },
    {
      id: "tc2",
      name: "Perfect Tree (7 nodes): [1, 2, 3, 4, 5, 6, 7]",
      preview: "Nodes: [1, 2, 3, 4, 5, 6, 7]",
      data: { values: [1, 2, 3, 4, 5, 6, 7] },
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
