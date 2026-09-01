import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { toArrayState } from "../../structures/array/helpers";

export function generateFrames(data: { nums: number[] }): Scene[] {
  const { nums } = data;
  const builder = new FrameBuilder<Scene>();
  const n = nums?.length || 0;

  if (n === 0) {
    builder.pushFrame({
      phase: "Empty Array",
      codeLine: 12,
      explanation: "Array is empty. Return 0.",
      structures: {
        array: toArrayState([], { name: "nums" }),
      },
      variables: { minVal: "N/A" },
    });
    return builder.getFrames();
  }

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
          name: "nums (Rotated)",
          pointers,
          activeIndex: opts.activeIndex,
          matchIndex: opts.matchIndex,
        }),
      },
      variables: {
        ...variables,
      },
    });
  };

  buildFrame(
    "Initialization",
    1,
    `Start binary search for minimum element in rotated sorted array of length ${n}.`,
    { LEFT: 0, RIGHT: n - 1 },
    { left: 0, right: n - 1, minVal: "Searching" },
  );

  let left = 0;
  let right = n - 1;

  buildFrame(
    "Set Search Range",
    2,
    `Initialize left = 0 (val: ${nums[0]}), right = ${right} (val: ${nums[right]}).`,
    { LEFT: left, RIGHT: right },
    { left, right, "nums[right]": nums[right], minVal: "Searching" },
  );

  while (left < right) {
    buildFrame(
      "Check Loop Condition",
      4,
      `left < right (${left} < ${right}) holds. Active window size is ${right - left + 1}.`,
      { LEFT: left, RIGHT: right },
      { left, right, "nums[right]": nums[right], minVal: "Searching" },
    );

    const mid = Math.floor((left + right) / 2);
    const midVal = nums[mid];
    const rightVal = nums[right];

    buildFrame(
      "Compute Mid",
      5,
      `mid = ⌊(${left} + ${right}) / 2⌋ = ${mid}. Compare nums[mid] (${midVal}) with nums[right] (${rightVal}).`,
      { LEFT: left, MID: mid, RIGHT: right },
      {
        left,
        right,
        mid,
        "nums[mid]": midVal,
        "nums[right]": rightVal,
        minVal: "Evaluating",
      },
      { activeIndex: mid },
    );

    if (midVal > rightVal) {
      buildFrame(
        "nums[mid] > nums[right]",
        6,
        `nums[${mid}] (${midVal}) > nums[${right}] (${rightVal}). The drop occurs in right half! Minimum is strictly to the right of mid.`,
        { LEFT: left, MID: mid, RIGHT: right },
        {
          left,
          right,
          mid,
          "nums[mid]": midVal,
          "nums[right]": rightVal,
          comparison: `${midVal} > ${rightVal} (Drop Right)`,
        },
        { activeIndex: mid },
      );
      left = mid + 1;
      buildFrame(
        "Shift Left",
        7,
        `Set left = mid + 1 = ${left}. Pruned left half indices 0 to ${mid}.`,
        { LEFT: left, RIGHT: right },
        { left, right, "nums[right]": nums[right], minVal: "Searching" },
      );
    } else {
      buildFrame(
        "nums[mid] <= nums[right]",
        8,
        `nums[${mid}] (${midVal}) <= nums[${right}] (${rightVal}). The right half is sorted! Minimum is at mid or in left half.`,
        { LEFT: left, MID: mid, RIGHT: right },
        {
          left,
          right,
          mid,
          "nums[mid]": midVal,
          "nums[right]": rightVal,
          comparison: `${midVal} <= ${rightVal} (Right Sorted)`,
        },
        { activeIndex: mid },
      );
      right = mid;
      buildFrame(
        "Shift Right",
        9,
        `Set right = mid = ${right}. Pruned right half indices ${mid + 1} to ${n - 1}.`,
        { LEFT: left, RIGHT: right },
        { left, right, "nums[right]": nums[right], minVal: "Searching" },
      );
    }
  }

  const minElement = nums[left];
  buildFrame(
    "★ Minimum Found",
    12,
    `Pointers converged at index ${left}. Minimum element is nums[${left}] = ${minElement}.`,
    { MIN: left },
    {
      left,
      right,
      "min index": left,
      "min value": minElement,
      result: minElement,
    },
    { matchIndex: left },
  );

  return builder.getFrames();
}

export default generateFrames;
