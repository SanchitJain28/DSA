import type { ProblemMeta } from "../../shared/types";

export interface ClimbStairsTreeData {
  n: number;
}

export const meta: ProblemMeta<ClimbStairsTreeData> = {
  id: "climbstairstree",
  title: "Climbing Stairs (Recursion Tree)",
  difficulty: "Easy",
  category: "Recursion & DP",
  topicId: "recursion",
  theme: "emerald",
  description:
    "Visualize the recursive decision tree for climbing n stairs taking 1 or 2 steps at a time.",
  tags: ["Recursion Tree", "Decision Tree", "Fibonacci", "Call Stack"],
  structures: ["tree"],
  inputSchema: [
    {
      key: "n",
      label: "Number of Steps (n)",
      type: "number",
      placeholder: "4",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Small Steps: n = 3 (3 Ways)",
      preview: "n = 3",
      data: { n: 3 },
    },
    {
      id: "tc2",
      name: "Standard: n = 4 (5 Ways)",
      preview: "n = 4",
      data: { n: 4 },
    },
    {
      id: "tc3",
      name: "Larger: n = 5 (8 Ways)",
      preview: "n = 5",
      data: { n: 5 },
    },
    {
      id: "tc4",
      name: "Base Case: n = 2 (2 Ways)",
      preview: "n = 2",
      data: { n: 2 },
    },
  ],
};

export default meta;
