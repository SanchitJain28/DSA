import type { ProblemMeta } from "../../shared/types";

export interface IsAnagramData {
  s: string;
  p: string;
}

export const meta: ProblemMeta<IsAnagramData> = {
  id: "isanagram",
  title: "Valid Anagram",
  difficulty: "Easy",
  category: "Arrays & Hashing",
  topicId: "arrays",
  theme: "sky",
  description:
    "Check if two strings contain identical character frequency distributions.",
  tags: ["Hash Map", "String", "Frequency"],
  structures: ["array", "hashmap"],
  inputSchema: [
    {
      key: "s",
      label: "First String (s)",
      type: "string",
      placeholder: "anagram",
    },
    {
      key: "p",
      label: "Second String (p)",
      type: "string",
      placeholder: "nagaram",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Standard Anagram: 'anagram' & 'nagaram'",
      preview: "s: 'anagram', p: 'nagaram'",
      data: { s: "anagram", p: "nagaram" },
    },
    {
      id: "tc2",
      name: "Not Anagram: 'rat' & 'car'",
      preview: "s: 'rat', p: 'car'",
      data: { s: "rat", p: "car" },
    },
    {
      id: "tc3",
      name: "Short Match: 'listen' & 'silent'",
      preview: "s: 'listen', p: 'silent'",
      data: { s: "listen", p: "silent" },
    },
    {
      id: "tc4",
      name: "Different Counts: 'aab' & 'abb'",
      preview: "s: 'aab', p: 'abb'",
      data: { s: "aab", p: "abb" },
    },
  ],
};

export default meta;
