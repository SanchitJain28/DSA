import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { toArrayState } from "../../structures/array/helpers";

export function generateFrames(data: { nums: number[]; target: number }): Scene[] {
  const { nums, target } = data;
  const builder = new FrameBuilder<Scene>();

  const buildFrame = (
    phase: string,
    codeLine: number,
    explanation: string,
    pointers: Record<string, number> = {},
    variables: Record<string, string | number> = {},
    opts: { activeIndex?: number; matchIndex?: number } = {},
  ) => {
    builder.pushFrame({
      phase,
      codeLine,
      explanation,
      structures: {
        array: toArrayState(nums, {
          name: "nums (Sorted)",
          pointers,
          activeIndex: opts.activeIndex,
          matchIndex: opts.matchIndex,
        }),
      },
      variables: {
        target,
        ...variables,
      },
    });
  };

  buildFrame(
    "Initialization",
    1,
    `Start searchInsert() with nums = [${nums.join(", ")}] and target = ${target}.`,
    {},
    { "nums.length": nums.length },
  );

  let left = 0;
  buildFrame(
    "Setup Left",
    2,
    `Initialize left pointer = 0 (pointing to index 0, value = ${nums[0]}).`,
    { left },
    { left },
  );

  let right = nums.length - 1;
  buildFrame(
    "Setup Right",
    3,
    `Initialize right pointer = ${right} (pointing to index ${right}, value = ${nums[right]}).`,
    { left, right },
    { left, right },
  );

  while (left <= right) {
    buildFrame(
      "Loop Condition",
      4,
      `Check while (left <= right): ${left} <= ${right} is true. Active search window is [${left} ... ${right}].`,
      { left, right },
      { left, right, "window": `[${left}..${right}]` },
    );

    const mid = Math.floor((left + right) / 2);
    const midVal = nums[mid];

    buildFrame(
      "Calculate Mid",
      5,
      `Calculate mid = ⌊(${left} + ${right}) / 2⌋ = ${mid}. nums[${mid}] = ${midVal}.`,
      { left, right, mid },
      { left, right, mid, "nums[mid]": midVal },
      { activeIndex: mid },
    );

    if (midVal < target) {
      buildFrame(
        "Compare: Less Than",
        6,
        `nums[${mid}] (${midVal}) < target (${target}) is TRUE. Target is in right half. Set left = mid + 1 = ${mid + 1}.`,
        { left, right, mid },
        { left, right, mid, "nums[mid]": midVal, comparison: `${midVal} < ${target}` },
        { activeIndex: mid },
      );
      left = mid + 1;
      buildFrame(
        "Adjust Left",
        7,
        `Left pointer moved to index ${left}.`,
        left < nums.length ? { left, right } : { right },
        { left, right },
      );
    } else if (midVal > target) {
      buildFrame(
        "Compare: Greater Than",
        8,
        `nums[${mid}] (${midVal}) > target (${target}) is TRUE. Target is in left half. Set right = mid - 1 = ${mid - 1}.`,
        { left, right, mid },
        { left, right, mid, "nums[mid]": midVal, comparison: `${midVal} > ${target}` },
        { activeIndex: mid },
      );
      right = mid - 1;
      buildFrame(
        "Adjust Right",
        9,
        `Right pointer moved to index ${right}.`,
        right >= 0 ? { left, right } : { left },
        { left, right },
      );
    } else {
      buildFrame(
        "Found Exact Match",
        11,
        `Exact match found! nums[${mid}] === ${target}. Returning index ${mid}.`,
        { left, right, mid },
        { left, right, mid, "nums[mid]": midVal, result: mid },
        { activeIndex: mid, matchIndex: mid },
      );
      return builder.getFrames();
    }
  }

  buildFrame(
    "Loop Terminated",
    4,
    `Search window exhausted: left (${left}) > right (${right}). Target ${target} is not present.`,
    left < nums.length ? { left, right } : { right },
    { left, right },
  );

  buildFrame(
    "Return Insertion Index",
    14,
    `Returning left = ${left}. Target ${target} should be inserted at index ${left} to preserve sorted order.`,
    left < nums.length ? { insert: left } : {},
    { left, right, result: left, "insert index": left },
    left < nums.length ? { matchIndex: left } : {},
  );

  return builder.getFrames();
}

export default generateFrames;
