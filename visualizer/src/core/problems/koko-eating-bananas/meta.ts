import type { ProblemMeta } from "../../shared/types";

export interface KokoData {
  piles: number[];
  h: number;
}

export const meta: ProblemMeta<KokoData> = {
  id: "kokoeatingbananas",
  title: "Koko Eating Bananas",
  difficulty: "Medium",
  category: "Binary Search",
  topicId: "binary-search",
  theme: "teal",
  description:
    "Binary search on integer speed k in range [1 .. max(piles)] to find the minimum eating speed to finish all piles within h hours.",
  tags: ["Binary Search on Answer", "Monotonic Predicate"],
  structures: ["array", "range"],
  inputSchema: [
    {
      key: "piles",
      label: "Banana Piles (comma-separated)",
      type: "array",
      placeholder: "[3, 6, 7, 11]",
    },
    {
      key: "h",
      label: "Hours Available (h)",
      type: "number",
      placeholder: "8",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Piles: [3, 6, 7, 11] (h: 8)",
      preview: "Piles: [3, 6, 7, 11] · h: 8 hrs",
      data: { piles: [3, 6, 7, 11], h: 8 },
    },
    {
      id: "tc2",
      name: "Piles: [30, 11, 23, 4, 20] (h: 5)",
      preview: "Piles: [30, 11, 23, 4, 20] · h: 5 hrs",
      data: { piles: [30, 11, 23, 4, 20], h: 5 },
    },
    {
      id: "tc3",
      name: "Piles: [30, 11, 23, 4, 20] (h: 6)",
      preview: "Piles: [30, 11, 23, 4, 20] · h: 6 hrs",
      data: { piles: [30, 11, 23, 4, 20], h: 6 },
    },
  ],
};

export default meta;
