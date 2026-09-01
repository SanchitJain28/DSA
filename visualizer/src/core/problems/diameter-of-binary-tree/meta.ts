import type { ProblemMeta } from "../../shared/types";

export interface DiameterData {
  values: (number | null)[];
}

export const meta: ProblemMeta<DiameterData> = {
  id: "diameter",
  title: "Diameter of Binary Tree",
  difficulty: "Easy",
  category: "Trees & BST",
  topicId: "trees",
  theme: "emerald",
  description:
    "Compute the diameter (longest path between any two nodes) by finding max(leftDepth + rightDepth) at each node using postorder DFS.",
  tags: ["DFS", "Binary Tree", "Recursion", "Tree Height", "Path"],
  structures: ["tree"],
  inputSchema: [
    {
      key: "values",
      label: "Tree Nodes (Level-Order BFS Array)",
      type: "array",
      placeholder: "[1, 2, 3, 4, 5]",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Standard: [1, 2, 3, 4, 5]",
      preview: "Nodes: [1, 2, 3, 4, 5]",
      data: { values: [1, 2, 3, 4, 5] },
    },
    {
      id: "tc2",
      name: "Linear Chain: [1, 2, null, 3, null, 4]",
      preview: "Nodes: [1, 2, null, 3, null, 4]",
      data: { values: [1, 2, null, 3, null, 4] },
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
