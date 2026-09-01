import type { ProblemMeta } from "../../shared/types";

export interface GoodNodesData {
  values: (number | null)[];
}

export const meta: ProblemMeta<GoodNodesData> = {
  id: "goodnodes",
  title: "Count Good Nodes in Binary Tree",
  difficulty: "Medium",
  category: "Trees & BST",
  topicId: "trees",
  theme: "emerald",
  description:
    "Count the number of 'good' nodes in a binary tree (a node X is good if on the path from root to X there are no nodes with value greater than X).",
  tags: ["DFS", "Binary Tree", "Recursion", "Path Maximum", "Tree Traversal"],
  structures: ["tree"],
  inputSchema: [
    {
      key: "values",
      label: "Tree Nodes (Level-Order BFS Array)",
      type: "array",
      placeholder: "[3, 1, 4, 3, null, 1, 5]",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Standard: [3, 1, 4, 3, null, 1, 5]",
      preview: "4 Good Nodes: [3, 4, 5, 3]",
      data: { values: [3, 1, 4, 3, null, 1, 5] },
    },
    {
      id: "tc2",
      name: "Decreasing Chain: [3, 3, null, 4, 2]",
      preview: "3 Good Nodes",
      data: { values: [3, 3, null, 4, 2] },
    },
    {
      id: "tc3",
      name: "Single Node: [1]",
      preview: "1 Good Node",
      data: { values: [1] },
    },
  ],
};

export default meta;
