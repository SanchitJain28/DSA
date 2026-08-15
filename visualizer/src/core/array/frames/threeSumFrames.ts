import { FrameBuilder } from "../../shared/FrameBuilder";
import type { ArrayFrame } from "../types";

export function generateFrames(originalNums: number[]): ArrayFrame[] {
  const builder = new FrameBuilder<ArrayFrame>();
  const nums = [...originalNums];
  const result: number[][] = [];

  const getBaseFrame = (
    codeLine: number,
    phase: string,
    message: string,
    pointers: Record<string, number> = {},
    variables: Record<string, string | number> = {}
  ) => ({
    phase,
    codeLine,
    message,
    variables: {
      "nums.length": nums.length.toString(),
      result: JSON.stringify(result),
      ...variables,
    },
    arrays: [
      {
        id: "nums",
        name: "nums",
        values: [...nums],
        pointers,
      },
    ],
  });

  builder.pushFrame(getBaseFrame(1, "Initialization", "Start threeSum algorithm."));

  if (!nums.length) {
    builder.pushFrame(getBaseFrame(2, "Base Case", "Array is empty, returning []."));
    return builder.getFrames();
  }

  nums.sort((a, b) => a - b);
  builder.pushFrame(getBaseFrame(3, "Sorting", "Sorted the input array to easily skip duplicates and use two pointers."));

  builder.pushFrame(getBaseFrame(4, "Initialization", "Initialize result array."));
  builder.pushFrame(getBaseFrame(5, "Initialization", "Store length of array."));

  const n = nums.length;
  for (let i = 0; i < n - 2; i++) {
    builder.pushFrame(
      getBaseFrame(6, "Outer Loop", `Set i to ${i}, nums[i] = ${nums[i]}.`, { i }, { i })
    );

    if (i > 0 && nums[i] === nums[i - 1]) {
      builder.pushFrame(
        getBaseFrame(7, "Skip Duplicate", `nums[i] is same as previous, skipping to avoid duplicate triplets.`, { i }, { i })
      );
      continue;
    }

    let j = i + 1;
    let k = n - 1;

    builder.pushFrame(
      getBaseFrame(8, "Initialize Pointers", `Set j to i + 1 (${j}).`, { i, j }, { i, j })
    );
    builder.pushFrame(
      getBaseFrame(9, "Initialize Pointers", `Set k to end of array (${k}).`, { i, j, k }, { i, j, k })
    );

    while (j < k) {
      builder.pushFrame(
        getBaseFrame(10, "Inner Loop", `j < k (${j} < ${k}). Checking sum.`, { i, j, k }, { i, j, k })
      );

      const sum = nums[i] + nums[j] + nums[k];
      builder.pushFrame(
        getBaseFrame(11, "Calculate Sum", `sum = ${nums[i]} + ${nums[j]} + ${nums[k]} = ${sum}`, { i, j, k }, { i, j, k, sum })
      );

      if (sum === 0) {
        builder.pushFrame(
          getBaseFrame(12, "Found Triplet", `Sum is 0! We found a valid triplet.`, { i, j, k }, { i, j, k, sum })
        );

        result.push([nums[i], nums[j], nums[k]]);
        builder.pushFrame(
          getBaseFrame(13, "Add to Result", `Added [${nums[i]}, ${nums[j]}, ${nums[k]}] to result.`, { i, j, k }, { i, j, k, sum })
        );

        j++;
        k--;
        builder.pushFrame(
          getBaseFrame(14, "Move Pointers", `Moved j right and k left.`, { i, j, k }, { i, j, k, sum })
        );

        while (j < k && nums[j] === nums[j - 1]) {
          builder.pushFrame(
            getBaseFrame(16, "Skip Duplicate", `nums[j] is duplicate. Incrementing j.`, { i, j, k }, { i, j, k, sum })
          );
          j++;
        }

        while (j < k && nums[k] === nums[k + 1]) {
          builder.pushFrame(
            getBaseFrame(17, "Skip Duplicate", `nums[k] is duplicate. Decrementing k.`, { i, j, k }, { i, j, k, sum })
          );
          k--;
        }
      } else if (sum < 0) {
        builder.pushFrame(
          getBaseFrame(18, "Sum Too Small", `Sum is < 0. Need a larger number.`, { i, j, k }, { i, j, k, sum })
        );
        j++;
        builder.pushFrame(
          getBaseFrame(19, "Move Pointer", `Incrementing j to ${j}.`, { i, j, k }, { i, j, k, sum })
        );
      } else {
        builder.pushFrame(
          getBaseFrame(20, "Sum Too Large", `Sum is > 0. Need a smaller number.`, { i, j, k }, { i, j, k, sum })
        );
        k--;
        builder.pushFrame(
          getBaseFrame(21, "Move Pointer", `Decrementing k to ${k}.`, { i, j, k }, { i, j, k, sum })
        );
      }
    }
  }

  builder.pushFrame(getBaseFrame(25, "Return", "Algorithm complete. Returning result."));

  return builder.getFrames();
}
