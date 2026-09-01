import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function climbStairs(n: number): number {" },
  { line: 2, text: "  if (n <= 2) return n;" },
  { line: 3, text: "  return climbStairs(n - 1) + climbStairs(n - 2);" },
  { line: 4, text: "}" },
];

export default source;
