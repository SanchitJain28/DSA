import { FrameBuilder } from "../../shared/FrameBuilder";
import type { ArrayFrame, ArrayData } from "../../array/types";

export function generateDpFrames(n: number): ArrayFrame[] {
  const builder = new FrameBuilder<ArrayFrame>();
  
  // We'll visualize the DP array of size n+1 initialized to null
  const dp: (number | null)[] = Array(n + 1).fill(null);
  
  // We'll also maintain the memo map string representation if we want,
  // but array visualization is clearer. We'll show both!
  const memo = new Map<number, number>();
  let activeIndex: number | null = null;
  
  const buildFrame = (phase: string, codeLine: number, message: string, variables: Record<string, string> = {}) => {
    const hashMapObj = Object.fromEntries(memo.entries());

    const pointers: Record<string, number> = {};
    if (activeIndex !== null && activeIndex >= 0 && activeIndex <= n) {
      pointers["n"] = activeIndex;
    }

    const arrays: ArrayData[] = [
      {
        id: "dp",
        name: "Memoization Table (n)",
        values: [...dp],
        pointers,
      }
    ];

    builder.pushFrame({
      phase,
      codeLine,
      message,
      variables: {
        n: activeIndex !== null ? String(activeIndex) : "N/A",
        ...variables,
      },
      hashMap: hashMapObj,
      arrays,
    });
  };

  builder.pushFrame({
    phase: "Initialization",
    codeLine: 7,
    message: `Starting climbStairs_(${n}) with memoization.`,
    variables: { n: String(n) },
    hashMap: {},
    arrays: [
      {
        id: "dp",
        name: "Memoization Table (n)",
        values: [...dp],
        pointers: {},
      }
    ]
  });

  builder.executeCall(`climbStairs_(${n})`, () => {
    buildFrame("Init", 8, "Initialize an empty memoization map (and visually, an array to track progress).", {});

    function _dp(curr: number): number {
      activeIndex = curr;
      builder.pushCall(`dp(${curr})`);
      
      buildFrame("Call", 9, `Entering dp(${curr})`, {});
      
      buildFrame("Base Case Check", 10, `Checking if ${curr} <= 2`, {});
      if (curr <= 2) {
        dp[curr] = curr;
        memo.set(curr, curr);
        buildFrame("Base Case", 10, `${curr} <= 2, returning ${curr}`, { result: String(curr) });
        builder.popCall();
        return curr;
      }

      buildFrame("Memo Check", 11, `Checking if memo has ${curr}`, {});
      if (memo.has(curr)) {
        buildFrame("Memo Hit", 11, `memo has ${curr}, returning cached value ${memo.get(curr)}!`, { result: String(memo.get(curr)) });
        builder.popCall();
        return memo.get(curr)!;
      }

      buildFrame("Recursive Calls", 12, `Need to compute dp(${curr} - 1) and dp(${curr} - 2)`, {});
      
      const left = _dp(curr - 1);
      
      activeIndex = curr;
      buildFrame("After n-1", 12, `dp(${curr} - 1) returned ${left}. Now computing dp(${curr} - 2)`, { left: String(left) });

      const right = _dp(curr - 2);

      activeIndex = curr;
      const res = left + right;
      
      buildFrame("Compute Result", 12, `Computed ${left} + ${right} = ${res}`, { left: String(left), right: String(right), result: String(res) });

      memo.set(curr, res);
      dp[curr] = res;
      buildFrame("Store in Memo", 13, `Stored dp(${curr}) = ${res} in memo table`, { result: String(res) });

      buildFrame("Return", 14, `Returning ${res}`, { result: String(res) });
      builder.popCall();
      return res;
    }

    _dp(n);
    
    activeIndex = null;
    buildFrame("Finished", 17, `Finished execution! Total ways: ${dp[n]}`, { finalResult: String(dp[n]) });
  });

  return builder.getFrames();
}
