import type { ArrayFrame } from "../types";
import { FrameBuilder } from "../../shared/FrameBuilder";

export function generateFrames(nums: number[]): ArrayFrame[] {
  const builder = new FrameBuilder<ArrayFrame>();

  // Clone initial nums array
  const currentNums = [...nums];
  const result: (number | null)[] = new Array(nums.length).fill(null);

  let left = 0;
  let right = nums.length - 1;
  let pos = nums.length - 1;

  const buildArrays = (): ArrayFrame["arrays"] => [
    {
      id: "nums",
      name: "nums",
      values: [...currentNums],
      pointers: { left, right },
    },
    {
      id: "result",
      name: "result",
      values: [...result],
      pointers: { pos },
    },
  ];

  builder.pushFrame({
    phase: "Initialization",
    codeLine: 1,
    message: "Initializing sortedSquares function.",
    arrays: buildArrays(),
    variables: { left: "N/A", right: "N/A", pos: "N/A" },
  });

  builder.executeCall(`sortedSquares([${nums.join(",")}])`, () => {
    builder.pushFrame({
      phase: "Setup Pointers",
      codeLine: 5,
      message:
        "Set left to start, right to end, and pos to the end of result array.",
      arrays: buildArrays(),
      variables: { left, right, pos },
    });

    while (left <= right) {
      builder.pushFrame({
        phase: "Loop Condition",
        codeLine: 6,
        message: `Check if left (${left}) <= right (${right}). Continuing loop.`,
        arrays: buildArrays(),
        variables: { left, right, pos },
      });

      const leftSq = nums[left] ** 2;
      const rightSq = nums[right] ** 2;

      builder.pushFrame({
        activeNodeIds: [`nums-${left}`, `nums-${right}`],
        phase: "Calculate Squares",
        codeLine: 8,
        message: `Calculated squares: leftSq = ${leftSq}, rightSq = ${rightSq}.`,
        arrays: buildArrays(),
        variables: { left, right, pos, leftSq, rightSq },
      });

      builder.pushFrame({
        activeNodeIds: [`nums-${left}`, `nums-${right}`],
        phase: "Compare Squares",
        codeLine: 9,
        message: `Is leftSq (${leftSq}) > rightSq (${rightSq})?`,
        arrays: buildArrays(),
        variables: { left, right, pos, leftSq, rightSq },
      });

      if (leftSq > rightSq) {
        result[pos] = leftSq;

        builder.pushFrame({
          activeNodeIds: [`nums-${left}`, `result-${pos}`],
          phase: "Place Left Square",
          codeLine: 10,
          message: `leftSq is larger. Placed ${leftSq} at pos ${pos} in result.`,
          arrays: buildArrays(),
          variables: { left, right, pos, leftSq, rightSq },
        });

        left++;

        builder.pushFrame({
          phase: "Increment Left",
          codeLine: 11,
          message: `Incremented left pointer to ${left}.`,
          arrays: buildArrays(),
          variables: { left, right, pos, leftSq, rightSq },
        });
      } else {
        result[pos] = rightSq;

        builder.pushFrame({
          activeNodeIds: [`nums-${right}`, `result-${pos}`],
          phase: "Place Right Square",
          codeLine: 13,
          message: `rightSq is larger or equal. Placed ${rightSq} at pos ${pos} in result.`,
          arrays: buildArrays(),
          variables: { left, right, pos, leftSq, rightSq },
        });

        right--;

        builder.pushFrame({
          phase: "Decrement Right",
          codeLine: 14,
          message: `Decremented right pointer to ${right}.`,
          arrays: buildArrays(),
          variables: { left, right, pos, leftSq, rightSq },
        });
      }

      pos--;

      builder.pushFrame({
        phase: "Decrement Pos",
        codeLine: 16,
        message: `Decremented pos pointer to ${pos}.`,
        arrays: buildArrays(),
        variables: { left, right, pos },
      });
    }

    builder.pushFrame({
      phase: "Loop End",
      codeLine: 6,
      message: `Loop finished because left (${left}) > right (${right}).`,
      arrays: buildArrays(),
      variables: { left, right, pos },
    });
  });

  builder.pushFrame({
    phase: "Finished",
    codeLine: 18,
    message: "Returned the sorted squared array.",
    arrays: buildArrays(),
    variables: { left, right, pos },
  });

  return builder.getFrames();
}
