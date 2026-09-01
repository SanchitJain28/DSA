import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { toArrayState } from "../../structures/array/helpers";

export function generateFrames(data: { nums: number[] }): Scene[] {
  const { nums: inputNums } = data;
  const builder = new FrameBuilder<Scene>();
  const nums = [...inputNums];
  const result: number[][] = [];

  const buildFrame = (
    phase: string,
    codeLine: number,
    explanation: string,
    pointers: Record<string, number> = {},
    variables: Record<string, string | number> = {},
    opts: { isMatch?: boolean } = {},
  ) => {
    const arrays = [
      toArrayState(nums, {
        id: "nums",
        name: "Array (nums)",
        pointers,
        matchIndices: opts.isMatch && pointers.i !== undefined && pointers.j !== undefined && pointers.k !== undefined
          ? [pointers.i, pointers.j, pointers.k]
          : undefined,
      }),
    ];

    if (result.length > 0) {
      arrays.push(
        toArrayState(result.map((triplet) => [...triplet]), {
          id: "result",
          name: "Found Triplets (result)",
          matchIndex: result.length - 1,
        }),
      );
    }

    builder.pushFrame({
      phase,
      codeLine,
      explanation,
      structures: {
        arrays,
      },
      variables: {
        "nums.length": nums.length,
        "triplets found": result.length,
        ...variables,
      },
    });
  };

  buildFrame("Initialization", 1, "Start threeSum algorithm.");

  if (!nums.length) {
    buildFrame("Base Case", 2, "Array is empty, returning [].");
    return builder.getFrames();
  }

  nums.sort((a, b) => a - b);
  buildFrame("Sorting", 3, "Sorted input array to enable two-pointer approach and skip duplicates.");
  buildFrame("Initialization", 4, "Initialize result array to store unique zero-sum triplets.");

  const n = nums.length;
  for (let i = 0; i < n - 2; i++) {
    buildFrame(
      "Outer Loop",
      6,
      `Outer loop: set i to ${i} (nums[i] = ${nums[i]}).`,
      { i },
      { i, "nums[i]": nums[i] },
    );

    if (i > 0 && nums[i] === nums[i - 1]) {
      buildFrame(
        "Skip Duplicate",
        7,
        `nums[${i}] (${nums[i]}) is duplicate of nums[${i - 1}]. Skipping to avoid duplicate triplets.`,
        { i },
        { i, "nums[i]": nums[i] },
      );
      continue;
    }

    let j = i + 1;
    let k = n - 1;

    buildFrame(
      "Init Pointers",
      8,
      `Set left pointer j = ${j} and right pointer k = ${k}.`,
      { i, j, k },
      { i, j, k },
    );

    while (j < k) {
      buildFrame(
        "Inner Loop",
        9,
        `Inner condition met: j (${j}) < k (${k}).`,
        { i, j, k },
        { i, j, k },
      );

      const sum = nums[i] + nums[j] + nums[k];
      const sumVars = { i, j, k, sum };

      buildFrame(
        "Calculate Sum",
        10,
        `Sum = nums[${i}] (${nums[i]}) + nums[${j}] (${nums[j]}) + nums[${k}] (${nums[k]}) = ${sum}.`,
        { i, j, k },
        sumVars,
      );

      if (sum === 0) {
        result.push([nums[i], nums[j], nums[k]]);
        buildFrame(
          "Found Triplet",
          11,
          `Sum is 0! Added triplet [${nums[i]}, ${nums[j]}, ${nums[k]}] to result.`,
          { i, j, k },
          sumVars,
          { isMatch: true },
        );

        j++;
        k--;
        buildFrame(
          "Move Pointers",
          13,
          `Moved j right to ${j} and k left to ${k}.`,
          { i, j, k },
          sumVars,
        );

        while (j < k && nums[j] === nums[j - 1]) {
          buildFrame(
            "Skip Duplicate",
            14,
            `nums[${j}] (${nums[j]}) is a duplicate. Incrementing j to ${j + 1}.`,
            { i, j, k },
            sumVars,
          );
          j++;
        }

        while (j < k && nums[k] === nums[k + 1]) {
          buildFrame(
            "Skip Duplicate",
            15,
            `nums[${k}] (${nums[k]}) is a duplicate. Decrementing k to ${k - 1}.`,
            { i, j, k },
            sumVars,
          );
          k--;
        }
      } else if (sum < 0) {
        buildFrame(
          "Sum Too Small",
          16,
          `Sum (${sum}) < 0. We need a larger number, so increment j to ${j + 1}.`,
          { i, j, k },
          sumVars,
        );
        j++;
      } else {
        buildFrame(
          "Sum Too Large",
          18,
          `Sum (${sum}) > 0. We need a smaller number, so decrement k to ${k - 1}.`,
          { i, j, k },
          sumVars,
        );
        k--;
      }
    }
  }

  buildFrame("Return", 23, `Algorithm complete. Returning ${result.length} triplets.`);
  return builder.getFrames();
}

export default generateFrames;
