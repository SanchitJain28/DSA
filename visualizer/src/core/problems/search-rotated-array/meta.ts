import type { ProblemMeta } from "../../shared/types";

export interface SearchRotatedData {
  nums: number[];
  target: number;
}

export const meta: ProblemMeta<SearchRotatedData> = {
  id: "searchrotated",
  title: "Search in Rotated Sorted Array",
  difficulty: "Medium",
  category: "Binary Search",
  topicId: "binary-search",
  theme: "sky",
  description:
    "Find target index in a rotated sorted array in O(log n) time by finding the pivot (minimum element) and binary searching the target segment.",
  tags: ["Binary Search", "Rotated Array", "Two Phase"],
  structures: ["array"],
  inputSchema: [
    {
      key: "nums",
      label: "Rotated Sorted Numbers (comma-separated)",
      type: "array",
      placeholder: "[4, 5, 6, 7, 0, 1, 2]",
    },
    {
      key: "target",
      label: "Target Value",
      type: "number",
      placeholder: "0",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Target Exists: 0 in [4, 5, 6, 7, 0, 1, 2]",
      preview: "Nums: [4, 5, 6, 7, 0, 1, 2] · Target: 0",
      data: { nums: [4, 5, 6, 7, 0, 1, 2], target: 0 },
    },
    {
      id: "tc2",
      name: "Target Not Found: 3 in [4, 5, 6, 7, 0, 1, 2]",
      preview: "Nums: [4, 5, 6, 7, 0, 1, 2] · Target: 3",
      data: { nums: [4, 5, 6, 7, 0, 1, 2], target: 3 },
    },
    {
      id: "tc3",
      name: "Target in Left Half: 6 in [4, 5, 6, 7, 0, 1, 2]",
      preview: "Nums: [4, 5, 6, 7, 0, 1, 2] · Target: 6",
      data: { nums: [4, 5, 6, 7, 0, 1, 2], target: 6 },
    },
  ],
};

export default meta;
