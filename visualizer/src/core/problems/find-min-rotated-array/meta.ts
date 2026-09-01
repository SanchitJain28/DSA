import type { ProblemMeta } from "../../shared/types";

export interface FindMinData {
  nums: number[];
}

export const meta: ProblemMeta<FindMinData> = {
  id: "findmin",
  title: "Find Minimum in Rotated Sorted Array",
  difficulty: "Medium",
  category: "Binary Search",
  topicId: "binary-search",
  theme: "sky",
  description:
    "Find the minimum element in a sorted rotated array in O(log n) time by comparing nums[mid] to nums[right].",
  tags: ["Binary Search", "Rotated Array", "Inflection Point"],
  structures: ["array"],
  inputSchema: [
    {
      key: "nums",
      label: "Rotated Sorted Numbers (comma-separated)",
      type: "array",
      placeholder: "[3, 4, 5, 1, 2]",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Rotated: [3, 4, 5, 1, 2] (Min: 1)",
      preview: "Nums: [3, 4, 5, 1, 2]",
      data: { nums: [3, 4, 5, 1, 2] },
    },
    {
      id: "tc2",
      name: "Rotated: [4, 5, 6, 7, 0, 1, 2] (Min: 0)",
      preview: "Nums: [4, 5, 6, 7, 0, 1, 2]",
      data: { nums: [4, 5, 6, 7, 0, 1, 2] },
    },
    {
      id: "tc3",
      name: "Fully Sorted / Not Rotated: [11, 13, 15, 17]",
      preview: "Nums: [11, 13, 15, 17]",
      data: { nums: [11, 13, 15, 17] },
    },
    {
      id: "tc4",
      name: "Single Element: [1]",
      preview: "Nums: [1]",
      data: { nums: [1] },
    },
  ],
};

export default meta;
