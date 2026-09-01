import type { ProblemMeta } from "../../shared/types";

export interface LongestCharReplacementData {
  s: string;
  k: number;
}

export const meta: ProblemMeta<LongestCharReplacementData> = {
  id: "longestcharreplacement",
  title: "Longest Repeating Character Replacement",
  difficulty: "Medium",
  category: "Sliding Window",
  topicId: "sliding-window",
  theme: "indigo",
  description:
    "Find the length of the longest substring containing the same letter you can get after performing at most k character replacements using a dynamic sliding window.",
  tags: ["Sliding Window", "Two Pointers", "Frequency Map"],
  structures: ["array", "hashmap"],
  inputSchema: [
    {
      key: "s",
      label: "String (s)",
      type: "string",
      placeholder: "AABABBA",
    },
    {
      key: "k",
      label: "Max Replacements (k)",
      type: "number",
      placeholder: "1",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Classic Alternating: ABAB (k = 2)",
      preview: 's = "ABAB", k = 2',
      data: { s: "ABAB", k: 2 },
    },
    {
      id: "tc2",
      name: "Standard Mix: AABABBA (k = 1)",
      preview: 's = "AABABBA", k = 1',
      data: { s: "AABABBA", k: 1 },
    },
    {
      id: "tc3",
      name: "Consecutive Repeats: ABBB (k = 2)",
      preview: 's = "ABBB", k = 2',
      data: { s: "ABBB", k: 2 },
    },
    {
      id: "tc4",
      name: "All Identical: AAAA (k = 2)",
      preview: 's = "AAAA", k = 2',
      data: { s: "AAAA", k: 2 },
    },
    {
      id: "tc5",
      name: "All Distinct: ABCDE (k = 1)",
      preview: 's = "ABCDE", k = 1',
      data: { s: "ABCDE", k: 1 },
    },
  ],
};

export default meta;
