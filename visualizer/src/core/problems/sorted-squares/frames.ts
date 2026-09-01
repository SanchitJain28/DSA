import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { toArrayState } from "../../structures/array/helpers";

export function generateFrames(data: { nums: number[] }): Scene[] {
  const { nums } = data;
  const builder = new FrameBuilder<Scene>();

  const currentNums = [...nums];
  const result: (number | null)[] = new Array(nums.length).fill(null);

  let left = 0;
  let right = nums.length - 1;
  let pos = nums.length - 1;

  const buildFrame = (
    phase: string,
    codeLine: number,
    explanation: string,
    variables: Record<string, string | number> = {},
    opts: { activeNums?: number[]; activeResult?: number } = {},
  ) => {
    builder.pushFrame({
      phase,
      codeLine,
      explanation,
      structures: {
        arrays: [
          toArrayState(currentNums, {
            id: "nums",
            name: "Input Array (nums)",
            pointers: { left, right },
            activeIndices: opts.activeNums,
          }),
          toArrayState(result, {
            id: "result",
            name: "Result Squared Array (result)",
            pointers: pos >= 0 ? { pos } : {},
            activeIndex: opts.activeResult,
            matchIndex: opts.activeResult,
          }),
        ],
      },
      variables: {
        left,
        right,
        pos: pos >= 0 ? pos : "done",
        ...variables,
      },
    });
  };

  buildFrame("Initialization", 1, "Initializing sortedSquares function.", {
    left: "N/A",
    right: "N/A",
    pos: "N/A",
  });

  builder.executeCall(`sortedSquares([${nums.join(",")}])`, () => {
    buildFrame("Setup Pointers", 4, "Set left to 0, right to n-1, and pos to the end of result array.");

    while (left <= right) {
      buildFrame(
        "Loop Condition",
        5,
        `Check condition: left (${left}) <= right (${right}). Continue two-pointer loop.`,
      );

      const leftSq = nums[left] ** 2;
      const rightSq = nums[right] ** 2;

      buildFrame(
        "Calculate Squares",
        6,
        `Calculate squares: nums[${left}]² = ${leftSq}, nums[${right}]² = ${rightSq}.`,
        { leftSq, rightSq },
        { activeNums: [left, right] },
      );

      buildFrame(
        "Compare Squares",
        8,
        `Compare: is leftSq (${leftSq}) > rightSq (${rightSq})?`,
        { leftSq, rightSq },
        { activeNums: [left, right] },
      );

      if (leftSq > rightSq) {
        result[pos] = leftSq;
        buildFrame(
          "Place Left Square",
          9,
          `leftSq (${leftSq}) is larger. Placed ${leftSq} at result[${pos}].`,
          { leftSq, rightSq },
          { activeNums: [left], activeResult: pos },
        );

        left++;
        buildFrame(
          "Increment Left",
          10,
          `Incremented left pointer to ${left}.`,
          { leftSq, rightSq },
          { activeResult: pos },
        );
      } else {
        result[pos] = rightSq;
        buildFrame(
          "Place Right Square",
          12,
          `rightSq (${rightSq}) is larger or equal. Placed ${rightSq} at result[${pos}].`,
          { leftSq, rightSq },
          { activeNums: [right], activeResult: pos },
        );

        right--;
        buildFrame(
          "Decrement Right",
          13,
          `Decremented right pointer to ${right}.`,
          { leftSq, rightSq },
          { activeResult: pos },
        );
      }

      pos--;
      buildFrame("Decrement Pos", 15, `Decremented pos pointer to ${pos}.`);
    }

    buildFrame("Loop End", 5, `Loop finished because left (${left}) > right (${right}).`);
    buildFrame("Finished", 17, "Sorted squared array complete. Returning result array.");
    return result;
  });

  return builder.getFrames();
}

export default generateFrames;
