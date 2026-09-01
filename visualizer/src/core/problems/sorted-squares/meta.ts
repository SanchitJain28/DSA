import type { ProblemMeta } from "../../shared/types";

export interface SortedSquaresData {
  nums: number[];
}

export const meta: ProblemMeta<SortedSquaresData> = {
  id: "sortedsquares",
  title: "Squares of a Sorted Array",
  difficulty: "Easy",
  category: "Arrays & Hashing",
  topicId: "arrays",
  theme: "sky",
  description:
    "Square numbers and sort in O(n) time using opposing two pointers.",
  tags: ["Two Pointers", "Sorted Array"],
  structures: ["array"],
  inputSchema: [
    {
      key: "nums",
      label: "Sorted Array Numbers (comma-separated)",
      type: "array",
      placeholder: "[-4, -1, 0, 3, 10]",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Standard: [-4, -1, 0, 3, 10]",
      preview: "[-4, -1, 0, 3, 10]",
      data: { nums: [-4, -1, 0, 3, 10] },
    },
    {
      id: "tc2",
      name: "All Negative: [-7, -3, -2, -1]",
      preview: "[-7, -3, -2, -1]",
      data: { nums: [-7, -3, -2, -1] },
    },
    {
      id: "tc3",
      name: "All Positive: [1, 2, 3, 4, 5]",
      preview: "[1, 2, 3, 4, 5]",
      data: { nums: [1, 2, 3, 4, 5] },
    },
    {
      id: "tc4",
      name: "Symmetric: [-5, -3, -1, 1, 3, 5]",
      preview: "[-5, -3, -1, 1, 3, 5]",
      data: { nums: [-5, -3, -1, 1, 3, 5] },
    },
  ],
};

export default meta;
