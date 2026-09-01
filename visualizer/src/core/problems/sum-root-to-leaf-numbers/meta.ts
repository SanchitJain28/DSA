import type { ProblemMeta } from "../../shared/types";

export interface SumNumbersData {
  values: (number | null)[];
}

export const meta: ProblemMeta<SumNumbersData> = {
  id: "sumnumbers",
  title: "Sum Root to Leaf Numbers",
  difficulty: "Medium",
  category: "Trees & BST",
  topicId: "trees",
  theme: "emerald",
  description:
    "Calculate the total sum of all numbers formed along root-to-leaf paths (each path represents a decimal number).",
  tags: ["DFS", "Binary Tree", "Recursion", "Path Numbers"],
  structures: ["tree"],
  inputSchema: [
    {
      key: "values",
      label: "Tree Nodes (Level-Order BFS Array)",
      type: "array",
      placeholder: "[4, 9, 0, 5, 1]",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Example 1: [4, 9, 0, 5, 1]",
      preview: "495 + 491 + 40 = 1026",
      data: { values: [4, 9, 0, 5, 1] },
    },
    {
      id: "tc2",
      name: "Example 2: [1, 2, 3]",
      preview: "12 + 13 = 25",
      data: { values: [1, 2, 3] },
    },
    {
      id: "tc3",
      name: "Single Node: [9]",
      preview: "9",
      data: { values: [9] },
    },
  ],
};

export default meta;
