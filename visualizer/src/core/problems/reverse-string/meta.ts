import type { ProblemMeta } from "../../shared/types";

export interface ReverseStringData {
  s: string;
}

export const meta: ProblemMeta<ReverseStringData> = {
  id: "reversestring",
  title: "Reverse String",
  difficulty: "Easy",
  category: "Recursion & DP",
  topicId: "recursion",
  theme: "indigo",
  description:
    "Reverse a character array in-place using recursive two-pointer swap and call stack unwinding.",
  tags: ["Call Stack", "Recursion", "Two Pointers"],
  structures: ["array"],
  inputSchema: [
    {
      key: "s",
      label: "Input String",
      type: "string",
      placeholder: "hello",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: 'Classic: "hello"',
      preview: 's = "hello"',
      data: { s: "hello" },
    },
    {
      id: "tc2",
      name: 'Palindrome: "Hannah"',
      preview: 's = "Hannah"',
      data: { s: "Hannah" },
    },
    {
      id: "tc3",
      name: 'Longer: "recursion"',
      preview: 's = "recursion"',
      data: { s: "recursion" },
    },
    {
      id: "tc4",
      name: 'Two Characters: "AB"',
      preview: 's = "AB"',
      data: { s: "AB" },
    },
    {
      id: "tc5",
      name: 'Single Character: "a"',
      preview: 's = "a"',
      data: { s: "a" },
    },
  ],
};

export default meta;
