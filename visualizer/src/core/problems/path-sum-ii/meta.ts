import type { ProblemMeta } from "../../shared/types";

export interface PathSumIIData {
  values: (number | null)[];
  targetSum: number;
}

export const meta: ProblemMeta<PathSumIIData> = {
  id: "pathsum2",
  title: "Path Sum II",
  difficulty: "Medium",
  category: "Trees & BST",
  topicId: "trees",
  theme: "emerald",
  description:
    "Find all unique root-to-leaf paths where the sum of the node values equals targetSum using DFS backtracking.",
  tags: ["DFS", "Binary Tree", "Recursion", "Backtracking", "All Paths"],
  structures: ["tree"],
  inputSchema: [
    {
      key: "values",
      label: "Tree Nodes (Level-Order BFS Array)",
      type: "array",
      placeholder: "[5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1]",
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
      name: "Target 22 (Two Paths): [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1]",
      preview: "Two paths: [5,4,11,2] & [5,8,4,5]",
      data: {
        values: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1],
        targetSum: 22,
      },
    },
    {
      id: "tc2",
      name: "No Paths: [1, 2, 3]",
      preview: "Target 5 (No matching paths)",
      data: { values: [1, 2, 3], targetSum: 5 },
    },
  ],
};

export default meta;
