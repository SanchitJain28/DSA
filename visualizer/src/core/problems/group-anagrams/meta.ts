import type { ProblemMeta } from "../../shared/types";

export interface GroupAnagramsData {
  strs: string[];
}

export const meta: ProblemMeta<GroupAnagramsData> = {
  id: "groupanagrams",
  title: "Group Anagrams",
  difficulty: "Medium",
  category: "Arrays & Hashing",
  topicId: "arrays",
  theme: "violet",
  description:
    "Group strings together using sorted character keys in a hash map.",
  tags: ["Hash Map", "Sorting", "Categorization"],
  structures: ["array", "hashmap"],
  inputSchema: [
    {
      key: "strs",
      label: "String Array (comma-separated)",
      type: "array",
      placeholder: '["eat", "tea", "tan", "ate", "nat", "bat"]',
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: 'Classic: ["eat", "tea", "tan", "ate", "nat", "bat"]',
      preview: '["eat", "tea", "tan", "ate", "nat", "bat"]',
      data: { strs: ["eat", "tea", "tan", "ate", "nat", "bat"] },
    },
    {
      id: "tc2",
      name: 'Single Empty: [""]',
      preview: '[""]',
      data: { strs: [""] },
    },
    {
      id: "tc3",
      name: 'Single Char: ["a"]',
      preview: '["a"]',
      data: { strs: ["a"] },
    },
    {
      id: "tc4",
      name: 'Disjoint: ["abc", "def", "ghi"]',
      preview: '["abc", "def", "ghi"]',
      data: { strs: ["abc", "def", "ghi"] },
    },
  ],
};

export default meta;
