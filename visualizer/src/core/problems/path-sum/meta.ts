import type { ProblemMeta } from "../../shared/types";

export interface PathSumData {
  values: (number | null)[];
  targetSum: number;
}

export const meta: ProblemMeta<PathSumData> = {
  id: "pathsum",
  title: "Path Sum",
  difficulty: "Easy",
  category: "Trees & BST",
  topicId: "trees",
  theme: "emerald",
  description:
    "Determine if the binary tree has a root-to-leaf path such that adding up all values along the path equals targetSum.",
  tags: ["DFS", "Binary Tree", "Recursion", "Path Sum", "Backtracking"],
  structures: ["tree"],
  inputSchema: [
    {
      key: "values",
      label: "Tree Nodes (Level-Order BFS Array)",
      type: "array",
      placeholder: "[5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1]",
    },
    {
      key: "targetSum",
      label: "Target Sum",
      type: "number",
      placeholder: "22",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Target 22: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1]",
      preview: "Target 22: 5 -> 4 -> 11 -> 2 = 22",
      data: {
        values: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1],
        targetSum: 22,
      },
    },
    {
      id: "tc2",
      name: "Target 5: [1, 2, 3]",
      preview: "Target 5 (No match: 1+2=3, 1+3=4)",
      data: { values: [1, 2, 3], targetSum: 5 },
    },
    {
      id: "tc3",
      name: "Single Node Target 1: [1]",
      preview: "Target 1 (Match: 1)",
      data: { values: [1], targetSum: 1 },
    },
  ],
};

export default meta;
