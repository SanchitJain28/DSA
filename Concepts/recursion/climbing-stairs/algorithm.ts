function climbStairs(n: number): number {
  if (n <= 2) return n;
  return climbStairs(n - 1) + climbStairs(n - 2);
}

// ? With memoization
function climbStairs_(n: number): number {
  const memo = new Map<number, number>();
  function dp(n: number): number {
    if (n <= 2) return n;
    if (memo.has(n)) return memo.get(n)!;
    const result = dp(n - 1) + dp(n - 2);
    memo.set(n, result);
    return result;
  }
  return dp(n);
}
