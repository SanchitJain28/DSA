import type { ProblemMeta } from "../../shared/types";

export interface MaxPathSumData {
  values: (number | null)[];
}

export const meta: ProblemMeta<MaxPathSumData> = {
  id: "maxpathsum",
  title: "Binary Tree Maximum Path Sum",
  difficulty: "Hard",
  category: "Trees & BST",
  topicId: "trees",
  theme: "emerald",
  description:
    "Find the maximum path sum along any sequence of nodes in a binary tree using bottom-up postorder DFS (ignoring negative subtrees).",
  tags: ["DFS", "Binary Tree", "Recursion", "Path Sum", "Hard", "Postorder"],
  structures: ["tree"],
  inputSchema: [
    {
      key: "values",
      label: "Tree Nodes (Level-Order BFS Array)",
      type: "array",
      placeholder: "[-10, 9, 20, null, null, 15, 7]",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Standard: [-10, 9, 20, null, null, 15, 7]",
      preview: "Max Path Sum: 15 + 20 + 7 = 42",
      data: { values: [-10, 9, 20, null, null, 15, 7] },
    },
    {
      id: "tc2",
      name: "Small: [1, 2, 3]",
      preview: "Max Path Sum: 2 + 1 + 3 = 6",
      data: { values: [1, 2, 3] },
    },
    {
      id: "tc3",
      name: "All Negative: [-3]",
      preview: "Max Path Sum: -3",
      data: { values: [-3] },
    },
  ],
};

export default meta;
