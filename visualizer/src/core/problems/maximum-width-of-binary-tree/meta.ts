import type { ProblemMeta } from "../../shared/types";

export interface WidthTreeData {
  values: (number | null)[];
}

export const meta: ProblemMeta<WidthTreeData> = {
  id: "widthofbinarytree",
  title: "Maximum Width of Binary Tree",
  difficulty: "Medium",
  category: "Trees & BST",
  topicId: "trees",
  theme: "indigo",
  description:
    "Find the maximum width among all levels where width is the length between the end-nodes (including null nodes between them), normalized using 0-indexed positioning.",
  tags: ["BFS", "Binary Tree", "Queue", "Tree Width", "Indexing"],
  structures: ["tree", "queue"],
  inputSchema: [
    {
      key: "values",
      label: "Tree Nodes (Level-Order BFS Array)",
      type: "array",
      placeholder: "[1, 3, 2, 5, 3, null, 9]",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Example 1: [1, 3, 2, 5, 3, null, 9]",
      preview: "Max Width: 4 (nodes [5, 3, null, 9])",
      data: { values: [1, 3, 2, 5, 3, null, 9] },
    },
    {
      id: "tc2",
      name: "Example 2: [1, 3, 2, 5, null, null, 9, 6, null, 7]",
      preview: "Max Width: 7",
      data: { values: [1, 3, 2, 5, null, null, 9, 6, null, 7] },
    },
  ],
};

export default meta;
