import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import type { ArrayData } from "../../structures/array/types";

export function generateFrames(data: { n: number }): Scene[] {
  const n = data.n;
  const builder = new FrameBuilder<Scene>();

  const dp: (number | null)[] = Array(n + 1).fill(null);
  const memo = new Map<number, number>();
  let activeIndex: number | null = null;

  const buildFrame = (
    phase: string,
    codeLine: number,
    explanation: string,
    variables: Record<string, string | number> = {},
  ) => {
    const hashMapObj: Record<string, string | number | boolean> = {};
    for (const [k, v] of memo.entries()) {
      hashMapObj[String(k)] = v;
    }

    const pointers: Record<string, number> = {};
    if (activeIndex !== null && activeIndex >= 0 && activeIndex <= n) {
      pointers["n"] = activeIndex;
    }

    const arrayData: ArrayData = {
      id: "dp",
      name: "Memoization Table (n)",
      values: [...dp],
      pointers,
    };

    builder.pushFrame({
      phase,
      codeLine,
      explanation,
      structures: {
        array: arrayData,
        hashmap: hashMapObj,
      },
      variables: {
        n: activeIndex !== null ? activeIndex : "N/A",
        ...variables,
      },
    });
  };

  // Initial frame
  const initArrayData: ArrayData = {
    id: "dp",
    name: "Memoization Table (n)",
    values: [...dp],
    pointers: {},
  };

  builder.pushFrame({
    phase: "Initialization",
    codeLine: 7,
    explanation: `Starting climbStairs_(${n}) with memoization.`,
    structures: {
      array: initArrayData,
      hashmap: {},
    },
    variables: { n },
  });

  builder.executeCall(`climbStairs_(${n})`, () => {
    buildFrame("Init", 8, "Initialize an empty memoization map.");

    function _dp(curr: number): number {
      activeIndex = curr;
      builder.pushCall(`dp(${curr})`);

      buildFrame("Call", 9, `Entering dp(${curr})`);

      buildFrame("Base Case Check", 10, `Checking if ${curr} <= 2`);
      if (curr <= 2) {
        dp[curr] = curr;
        memo.set(curr, curr);
        buildFrame("Base Case", 10, `${curr} <= 2, returning ${curr}`, {
          result: curr,
        });
        builder.popCall();
        return curr;
      }

      buildFrame("Memo Check", 11, `Checking if memo has ${curr}`);
      if (memo.has(curr)) {
        buildFrame(
          "Memo Hit",
          11,
          `memo has ${curr}, returning cached value ${memo.get(curr)}!`,
          { result: memo.get(curr)! },
        );
        builder.popCall();
        return memo.get(curr)!;
      }

      buildFrame(
        "Recursive Calls",
        12,
        `Need to compute dp(${curr} - 1) and dp(${curr} - 2)`,
      );

      const left = _dp(curr - 1);

      activeIndex = curr;
      buildFrame(
        "After n-1",
        12,
        `dp(${curr} - 1) returned ${left}. Now computing dp(${curr} - 2)`,
        { left },
      );

      const right = _dp(curr - 2);

      activeIndex = curr;
      const res = left + right;

      buildFrame("Compute Result", 12, `Computed ${left} + ${right} = ${res}`, {
        left,
        right,
        result: res,
      });

      memo.set(curr, res);
      dp[curr] = res;
      buildFrame("Store in Memo", 13, `Stored dp(${curr}) = ${res} in memo table`, {
        result: res,
      });

      buildFrame("Return", 14, `Returning ${res}`, { result: res });
      builder.popCall();
      return res;
    }

    _dp(n);

    activeIndex = null;
    buildFrame("Finished", 17, `Finished execution! Total ways: ${dp[n]}`, {
      finalResult: dp[n] ?? "N/A",
    });
  });

  return builder.getFrames();
}

export default generateFrames;
