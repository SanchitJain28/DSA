import type { ProblemMeta } from "../../shared/types";

export interface ValidParenthesesData {
  s: string;
}

export const meta: ProblemMeta<ValidParenthesesData> = {
  id: "validparentheses",
  title: "Valid Parentheses",
  difficulty: "Easy",
  category: "Stack",
  topicId: "stack",
  theme: "emerald",
  description:
    "Determine if an input string containing '(', ')', '{', '}', '[' and ']' is valid using a LIFO stack.",
  tags: ["Stack", "String", "Matching"],
  structures: ["stack"],
  inputSchema: [
    {
      key: "s",
      label: "Brackets String (s)",
      type: "string",
      placeholder: "()[]{}",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Mixed Valid: ()[]{}",
      preview: 's = "()[]{}"',
      data: { s: "()[]{}" },
    },
    {
      id: "tc2",
      name: "Nested Valid: ([{}])",
      preview: 's = "([{}])"',
      data: { s: "([{}])" },
    },
    {
      id: "tc3",
      name: "Mismatch Bracket: (]",
      preview: 's = "(]"',
      data: { s: "(]" },
    },
    {
      id: "tc4",
      name: "Wrong Order: ([)]",
      preview: 's = "([)]"',
      data: { s: "([)]" },
    },
    {
      id: "tc5",
      name: "Unclosed: (((",
      preview: 's = "((("',
      data: { s: "(((" },
    },
    {
      id: "tc6",
      name: "Premature Close: ]",
      preview: 's = "]"',
      data: { s: "]" },
    },
  ],
};

export default meta;
