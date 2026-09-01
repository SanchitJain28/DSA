import type { ProblemMeta } from "../../shared/types";

export interface IsValidBSTData {
  values: (number | null)[];
}

export const meta: ProblemMeta<IsValidBSTData> = {
  id: "isvalidbst",
  title: "Validate Binary Search Tree",
  difficulty: "Medium",
  category: "Trees & BST",
  topicId: "trees",
  theme: "emerald",
  description:
    "Determine if a binary tree is a valid Binary Search Tree (BST) where every node satisfies min < node.val < max recursively.",
  tags: ["BST", "Binary Search Tree", "DFS", "Recursion", "Range Bounds"],
  structures: ["tree"],
  inputSchema: [
    {
      key: "values",
      label: "Tree Nodes (Level-Order BFS Array)",
      type: "array",
      placeholder: "[2, 1, 3]",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Valid BST: [2, 1, 3]",
      preview: "Valid: 1 < 2 < 3",
      data: { values: [2, 1, 3] },
    },
    {
      id: "tc2",
      name: "Invalid BST: [5, 1, 4, null, null, 3, 6]",
      preview: "Invalid: 3 is in right subtree of 5",
      data: { values: [5, 1, 4, null, null, 3, 6] },
    },
    {
      id: "tc3",
      name: "Single Node: [1]",
      preview: "Valid: [1]",
      data: { values: [1] },
    },
  ],
};

export default meta;
