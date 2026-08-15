export const climbStairsTreeCode = [
  { line: 1, text: "function climbStairs(n: number): number {" },
  { line: 2, text: "  if (n <= 2) return n;" },
  { line: 3, text: "  return climbStairs(n - 1) + climbStairs(n - 2);" },
  { line: 4, text: "}" }
];

export const climbStairsDpCode = [
  { line: 7, text: "function climbStairs_(n: number): number {" },
  { line: 8, text: "  const memo = new Map<number, number>();" },
  { line: 9, text: "  function dp(n: number): number {" },
  { line: 10, text: "    if (n <= 2) return n;" },
  { line: 11, text: "    if (memo.has(n)) return memo.get(n)!;" },
  { line: 12, text: "    const result = dp(n - 1) + dp(n - 2);" },
  { line: 13, text: "    memo.set(n, result);" },
  { line: 14, text: "    return result;" },
  { line: 15, text: "  }" },
  { line: 16, text: "  return dp(n);" },
  { line: 17, text: "}" }
];
