import type { ProblemMeta } from "../../shared/types";

export interface RightSideViewData {
  values: (number | null)[];
}

export const meta: ProblemMeta<RightSideViewData> = {
  id: "rightsideview",
  title: "Binary Tree Right Side View",
  difficulty: "Medium",
  category: "Trees & BST",
  topicId: "trees",
  theme: "emerald",
  description:
    "Return the values of the nodes you can see ordered from top to bottom when standing on the right side of the binary tree.",
  tags: ["BFS", "Binary Tree", "Queue", "Right View", "Level Order"],
  structures: ["tree", "queue"],
  inputSchema: [
    {
      key: "values",
      label: "Tree Nodes (Level-Order BFS Array)",
      type: "array",
      placeholder: "[1, 2, 3, null, 5, null, 4]",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Example 1: [1, 2, 3, null, 5, null, 4]",
      preview: "Right View: [1, 3, 4]",
      data: { values: [1, 2, 3, null, 5, null, 4] },
    },
    {
      id: "tc2",
      name: "Example 2: [1, null, 3]",
      preview: "Right View: [1, 3]",
      data: { values: [1, null, 3] },
    },
    {
      id: "tc3",
      name: "Single Node: [1]",
      preview: "Right View: [1]",
      data: { values: [1] },
    },
  ],
};

export default meta;
