import type { ProblemMeta } from "../../shared/types";

export interface SubtreeData {
  root: (number | null)[];
  subRoot: (number | null)[];
}

export const meta: ProblemMeta<SubtreeData> = {
  id: "subtree",
  title: "Subtree of Another Tree",
  difficulty: "Easy",
  category: "Trees & BST",
  topicId: "trees",
  theme: "emerald",
  description:
    "Check if binary tree subRoot is a subtree of root with identical structure and node values.",
  tags: ["DFS", "Binary Tree", "Recursion", "Tree Comparison", "Subtree"],
  structures: ["tree"],
  inputSchema: [
    {
      key: "root",
      label: "Main Tree (Root) Array",
      type: "array",
      placeholder: "[3, 4, 5, 1, 2]",
    },
    {
      key: "subRoot",
      label: "Subtree (subRoot) Array",
      type: "array",
      placeholder: "[4, 1, 2]",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Valid Subtree: [3, 4, 5, 1, 2] vs [4, 1, 2]",
      preview: "root: [3, 4, 5, 1, 2], subRoot: [4, 1, 2]",
      data: { root: [3, 4, 5, 1, 2], subRoot: [4, 1, 2] },
    },
    {
      id: "tc2",
      name: "Invalid Subtree: [3, 4, 5, 1, 2, null, null, null, null, 0] vs [4, 1, 2]",
      preview: "root: [3, 4, 5, 1, 2, ...], subRoot: [4, 1, 2]",
      data: {
        root: [3, 4, 5, 1, 2, null, null, null, null, 0],
        subRoot: [4, 1, 2],
      },
    },
  ],
};

export default meta;
