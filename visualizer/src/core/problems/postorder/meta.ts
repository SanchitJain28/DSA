import type { ProblemMeta } from "../../shared/types";

export interface PostorderData {
  values: (number | null)[];
}

export const meta: ProblemMeta<PostorderData> = {
  id: "postorder",
  title: "Binary Tree Postorder Traversal",
  difficulty: "Easy",
  category: "Trees & BST",
  topicId: "trees",
  theme: "emerald",
  description:
    "Visit binary tree nodes in Left -> Right -> Root order for bottom-up calculation and subtree evaluation.",
  tags: ["DFS", "Binary Tree", "Postorder", "Bottom-up"],
  structures: ["tree"],
  inputSchema: [
    {
      key: "values",
      label: "Tree Nodes (Level-Order BFS Array)",
      type: "array",
      placeholder: "[4, 2, 7, 1, 3, 6, 9]",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Standard: [4, 2, 7, 1, 3, 6, 9]",
      preview: "Nodes: [4, 2, 7, 1, 3, 6, 9]",
      data: { values: [4, 2, 7, 1, 3, 6, 9] },
    },
    {
      id: "tc2",
      name: "Skewed: [1, 2, null, 3]",
      preview: "Nodes: [1, 2, null, 3]",
      data: { values: [1, 2, null, 3] },
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
