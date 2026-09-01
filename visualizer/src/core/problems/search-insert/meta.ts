import type { ProblemMeta } from "../../shared/types";

export interface SearchInsertData {
  nums: number[];
  target: number;
}

export const meta: ProblemMeta<SearchInsertData> = {
  id: "searchinsert",
  title: "Search Insert Position",
  difficulty: "Easy",
  category: "Binary Search",
  topicId: "binary-search",
  theme: "sky",
  description:
    "Find target index or insertion position in sorted array using binary search [left, right].",
  tags: ["Binary Search", "Range Halving"],
  structures: ["array"],
  inputSchema: [
    {
      key: "nums",
      label: "Sorted Array Numbers (comma-separated)",
      type: "array",
      placeholder: "[1, 3, 5, 6]",
    },
    {
      key: "target",
      label: "Target Value",
      type: "number",
      placeholder: "5",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Target Exists: [1, 3, 5, 6] (Target: 5)",
      preview: "Nums: [1, 3, 5, 6] · Target: 5",
      data: { nums: [1, 3, 5, 6], target: 5 },
    },
    {
      id: "tc2",
      name: "Insert in Middle: [1, 3, 5, 6] (Target: 2)",
      preview: "Nums: [1, 3, 5, 6] · Target: 2",
      data: { nums: [1, 3, 5, 6], target: 2 },
    },
    {
      id: "tc3",
      name: "Insert at End: [1, 3, 5, 6] (Target: 7)",
      preview: "Nums: [1, 3, 5, 6] · Target: 7",
      data: { nums: [1, 3, 5, 6], target: 7 },
    },
    {
      id: "tc4",
      name: "Insert at Start: [1, 3, 5, 6] (Target: 0)",
      preview: "Nums: [1, 3, 5, 6] · Target: 0",
      data: { nums: [1, 3, 5, 6], target: 0 },
    },
  ],
};

export default meta;
