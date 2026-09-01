import type { ProblemMeta } from "../../shared/types";

export interface ClimbStairsDpData {
  n: number;
}

export const meta: ProblemMeta<ClimbStairsDpData> = {
  id: "climbstairsdp",
  title: "Climbing Stairs (1D DP)",
  difficulty: "Easy",
  category: "Recursion & DP",
  topicId: "recursion",
  theme: "emerald",
  description:
    "Calculate distinct ways to climb n stairs using top-down memoization, filling a 1D DP table.",
  tags: ["Dynamic Programming", "Memoization", "Fibonacci", "1D DP"],
  structures: ["array"],
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
