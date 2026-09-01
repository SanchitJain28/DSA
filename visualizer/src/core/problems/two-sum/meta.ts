import type { ProblemMeta } from "../../shared/types";

export interface TwoSumData {
  nums: number[];
  target: number;
}

export const meta: ProblemMeta<TwoSumData> = {
  id: "twosum",
  title: "Two Sum",
  difficulty: "Easy",
  category: "Arrays & Hashing",
  topicId: "arrays",
  theme: "violet",
  description:
    "Find indices of two numbers that add up to target using a single-pass hash map.",
  tags: ["Hash Map", "Array", "Complement"],
  structures: ["array", "hashmap"],
  inputSchema: [
    {
      key: "nums",
      label: "Array Numbers (comma-separated)",
      type: "array",
      placeholder: "[2, 7, 11, 15]",
    },
    {
      key: "target",
      label: "Target Value",
      type: "number",
      placeholder: "9",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Classic Example: [2, 7, 11, 15] (Target: 9)",
      preview: "Nums: [2, 7, 11, 15] · Target: 9",
      data: { nums: [2, 7, 11, 15], target: 9 },
    },
    {
      id: "tc2",
      name: "Target at End: [3, 2, 4] (Target: 6)",
      preview: "Nums: [3, 2, 4] · Target: 6",
      data: { nums: [3, 2, 4], target: 6 },
    },
    {
      id: "tc3",
      name: "Duplicate Elements: [3, 3] (Target: 6)",
      preview: "Nums: [3, 3] · Target: 6",
      data: { nums: [3, 3], target: 6 },
    },
    {
      id: "tc4",
      name: "Larger Array: [1, 5, 3, 7, 9] (Target: 12)",
      preview: "Nums: [1, 5, 3, 7, 9] · Target: 12",
      data: { nums: [1, 5, 3, 7, 9], target: 12 },
    },
  ],
};

export default meta;
