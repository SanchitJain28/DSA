import type { ProblemMeta } from "../../shared/types";

export interface SymmetricTreeData {
  values: (number | null)[];
}

export const meta: ProblemMeta<SymmetricTreeData> = {
  id: "symmetric",
  title: "Symmetric Tree",
  difficulty: "Easy",
  category: "Trees & BST",
  topicId: "trees",
  theme: "emerald",
  description:
    "Check whether a binary tree is a mirror of itself (symmetric around its center) using simultaneous dual-pointer DFS recursion.",
  tags: ["DFS", "Binary Tree", "Recursion", "Mirror", "Symmetry"],
  structures: ["tree"],
  inputSchema: [
    {
      key: "values",
      label: "Tree Nodes (Level-Order BFS Array)",
      type: "array",
      placeholder: "[1, 2, 2, 3, 4, 4, 3]",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Symmetric: [1, 2, 2, 3, 4, 4, 3]",
      preview: "Nodes: [1, 2, 2, 3, 4, 4, 3]",
      data: { values: [1, 2, 2, 3, 4, 4, 3] },
    },
    {
      id: "tc2",
      name: "Asymmetric: [1, 2, 2, null, 3, null, 3]",
      preview: "Nodes: [1, 2, 2, null, 3, null, 3]",
      data: { values: [1, 2, 2, null, 3, null, 3] },
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
