import type { ProblemMeta } from "../../shared/types";

export interface LongestConsecutiveData {
  nums: number[];
}

export const meta: ProblemMeta<LongestConsecutiveData> = {
  id: "longestconsecutive",
  title: "Longest Consecutive Sequence",
  difficulty: "Medium",
  category: "Arrays & Hashing",
  topicId: "arrays",
  theme: "cyan",
  description:
    "Find length of longest contiguous integer streak in O(n) using a hash set.",
  tags: ["Hash Set", "Streak", "O(n)"],
  structures: ["set"],
  inputSchema: [
    {
      key: "nums",
      label: "Array Numbers (comma-separated)",
      type: "array",
      placeholder: "[100, 4, 200, 1, 3, 2]",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Example 1: [100, 4, 200, 1, 3, 2]",
      preview: "Longest: [1, 2, 3, 4] (Length = 4)",
      data: { nums: [100, 4, 200, 1, 3, 2] },
    },
    {
      id: "tc2",
      name: "Example 2: [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]",
      preview: "Longest: [0..8] (Length = 9)",
      data: { nums: [0, 3, 7, 2, 5, 8, 4, 6, 0, 1] },
    },
    {
      id: "tc3",
      name: "Multiple Sequences: [9, 1, 4, 7, 3, -1, 0, 5, 8, -1, 6]",
      preview: "Longest: [3..9] (Length = 7)",
      data: { nums: [9, 1, 4, 7, 3, -1, 0, 5, 8, -1, 6] },
    },
    {
      id: "tc4",
      name: "Duplicates Test: [1, 2, 0, 1]",
      preview: "Longest: [0, 1, 2] (Length = 3)",
      data: { nums: [1, 2, 0, 1] },
    },
    {
      id: "tc5",
      name: "Disjoint Numbers: [10, 20, 30, 40]",
      preview: "Longest: Single elements (Length = 1)",
      data: { nums: [10, 20, 30, 40] },
    },
  ],
};

export default meta;
