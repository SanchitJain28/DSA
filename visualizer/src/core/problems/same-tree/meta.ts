import type { ProblemMeta } from "../../shared/types";

export interface SameTreeData {
  p: (number | null)[];
  q: (number | null)[];
}

export const meta: ProblemMeta<SameTreeData> = {
  id: "sametree",
  title: "Same Tree",
  difficulty: "Easy",
  category: "Trees & BST",
  topicId: "trees",
  theme: "emerald",
  description:
    "Check if two binary trees are structurally identical and have the same node values using simultaneous DFS recursion.",
  tags: ["DFS", "Binary Tree", "Recursion", "Tree Comparison"],
  structures: ["tree"],
  inputSchema: [
    {
      key: "p",
      label: "Tree P (Level-Order BFS Array)",
      type: "array",
      placeholder: "[1, 2, 3]",
    },
    {
      key: "q",
      label: "Tree Q (Level-Order BFS Array)",
      type: "array",
      placeholder: "[1, 2, 3]",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Identical: [1, 2, 3] vs [1, 2, 3]",
      preview: "p: [1, 2, 3], q: [1, 2, 3]",
      data: { p: [1, 2, 3], q: [1, 2, 3] },
    },
    {
      id: "tc2",
      name: "Different Structure: [1, 2] vs [1, null, 2]",
      preview: "p: [1, 2], q: [1, null, 2]",
      data: { p: [1, 2], q: [1, null, 2] },
    },
    {
      id: "tc3",
      name: "Different Values: [1, 2, 1] vs [1, 1, 2]",
      preview: "p: [1, 2, 1], q: [1, 1, 2]",
      data: { p: [1, 2, 1], q: [1, 1, 2] },
    },
  ],
};

export default meta;
