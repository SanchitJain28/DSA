import type { ProblemMeta } from "../../shared/types";

export interface ThreeSumData {
  nums: number[];
}

export const meta: ProblemMeta<ThreeSumData> = {
  id: "threesum",
  title: "3Sum",
  difficulty: "Medium",
  category: "Arrays & Hashing",
  topicId: "arrays",
  theme: "teal",
  description:
    "Find all unique triplets that sum to zero with sorting and two pointers.",
  tags: ["Two Pointers", "Sorting", "Duplicate Handling"],
  structures: ["array"],
  inputSchema: [
    {
      key: "nums",
      label: "Array Numbers (comma-separated)",
      type: "array",
      placeholder: "[-1, 0, 1, 2, -1, -4]",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Classic: [-1, 0, 1, 2, -1, -4]",
      preview: "[-1, 0, 1, 2, -1, -4]",
      data: { nums: [-1, 0, 1, 2, -1, -4] },
    },
    {
      id: "tc2",
      name: "No Triplets: [0, 1, 1]",
      preview: "[0, 1, 1]",
      data: { nums: [0, 1, 1] },
    },
    {
      id: "tc3",
      name: "All Zeros: [0, 0, 0, 0]",
      preview: "[0, 0, 0, 0]",
      data: { nums: [0, 0, 0, 0] },
    },
    {
      id: "tc4",
      name: "Multiple Triplets: [-2, 0, 1, 1, 2]",
      preview: "[-2, 0, 1, 1, 2]",
      data: { nums: [-2, 0, 1, 1, 2] },
    },
  ],
};

export default meta;
