export const validParenthesesCode = [
  { line: 1, text: "function isValid(s: string): boolean {" },
  { line: 2, text: "  let pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };" },
  { line: 3, text: "  let stack: string[] = [];" },
  { line: 4, text: "  for (let ch of s) {" },
  { line: 5, text: "    if (!pairs[ch]) stack.push(ch);" },
  { line: 6, text: "    else {" },
  { line: 7, text: "      if (stack.pop() !== pairs[ch]) return false;" },
  { line: 8, text: "    }" },
  { line: 9, text: "  }" },
  { line: 10, text: "  return stack.length === 0;" },
  { line: 11, text: "}" },
];
