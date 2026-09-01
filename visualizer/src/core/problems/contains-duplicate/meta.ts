import type { ProblemMeta } from "../../shared/types";

export interface ContainsDuplicateData {
  nums: number[];
}

export const meta: ProblemMeta<ContainsDuplicateData> = {
  id: "containsduplicate",
  title: "Contains Duplicate",
  difficulty: "Easy",
  category: "Arrays & Hashing",
  topicId: "arrays",
  theme: "indigo",
  description:
    "Detect duplicate elements in an array using an instant-lookup hash set.",
  tags: ["Hash Set", "Lookup", "Frequency"],
  structures: ["array", "hashmap"],
  inputSchema: [
    {
      key: "nums",
      label: "Array Numbers (comma-separated)",
      type: "array",
      placeholder: "[1, 2, 3, 1]",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Duplicate at Ends: [1, 2, 3, 1]",
      preview: "Nums: [1, 2, 3, 1]",
      data: { nums: [1, 2, 3, 1] },
    },
    {
      id: "tc2",
      name: "All Unique: [1, 2, 3, 4]",
      preview: "Nums: [1, 2, 3, 4]",
      data: { nums: [1, 2, 3, 4] },
    },
    {
      id: "tc3",
      name: "Multiple Duplicates: [1, 1, 1, 3, 3, 4, 2]",
      preview: "Nums: [1, 1, 1, 3, 3, 4, 2]",
      data: { nums: [1, 1, 1, 3, 3, 4, 2] },
    },
    {
      id: "tc4",
      name: "Larger Unique Array: [10, 20, 30, 40, 50]",
      preview: "Nums: [10, 20, 30, 40, 50]",
      data: { nums: [10, 20, 30, 40, 50] },
    },
  ],
};

export default meta;
