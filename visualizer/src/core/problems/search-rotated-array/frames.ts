import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { toArrayState } from "../../structures/array/helpers";

export function generateFrames(data: {
  nums: number[];
  target: number;
}): Scene[] {
  const { nums, target } = data;
  const builder = new FrameBuilder<Scene>();
  const n = nums?.length || 0;

  if (n === 0) {
    builder.pushFrame({
      phase: "Empty Array",
      codeLine: 23,
      explanation: "Array is empty. Return -1.",
      structures: {
        array: toArrayState([], { name: "nums" }),
      },
      variables: { target, result: "-1 (Not Found)" },
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
        target,
        ...variables,
      },
    });
  };

  // Step 1: Initial Frame
  buildFrame(
    "Initialization",
    1,
    `Start search for target = ${target} in rotated sorted array of length ${n}.`,
    { LEFT: 0, RIGHT: n - 1 },
    { phase: "Init", left: 0, right: n - 1, result: "Searching" },
  );

  // ==========================================
  // PHASE 1: Find minIndex (Pivot)
  // ==========================================
  let left = 0;
  let right = n - 1;

  buildFrame(
    "Phase 1: Find Pivot",
    2,
    `Phase 1: Find minimum element index (pivot). Initialize left = 0, right = ${right}.`,
    { LEFT: left, RIGHT: right },
    { phase: "1. Find Pivot", left: 0, right },
  );

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    const midVal = nums[mid];
    const rightVal = nums[right];

    buildFrame(
      "Phase 1: Check Mid",
      5,
      `mid = ⌊(${left} + ${right}) / 2⌋ = ${mid}. Compare nums[mid] (${midVal}) < nums[right] (${rightVal}).`,
      { LEFT: left, MID: mid, RIGHT: right },
      {
        phase: "1. Find Pivot",
        left,
        right,
        mid,
        "nums[mid]": midVal,
        "nums[right]": rightVal,
      },
      { activeIndex: mid },
    );

    if (midVal < rightVal) {
      right = mid;
      buildFrame(
        "Phase 1: Right Half Sorted",
        6,
        `nums[${mid}] (${midVal}) < nums[${right}] (${rightVal}) -> Right half is sorted. Pivot is at or left of mid. Set right = ${right}.`,
        { LEFT: left, RIGHT: right },
        { phase: "1. Find Pivot", left, right, action: `right = ${right}` },
      );
    } else {
      left = mid + 1;
      buildFrame(
        "Phase 1: Drop in Right Half",
        7,
        `nums[${mid}] (${midVal}) >= nums[${right}] (${rightVal}) -> Drop occurs in right half. Set left = mid + 1 = ${left}.`,
        { LEFT: left, RIGHT: right },
        { phase: "1. Find Pivot", left, right, action: `left = ${left}` },
      );
    }
  }

  const minIndex = left;

  buildFrame(
    "★ Pivot Found",
    9,
    `Pivot found at minIndex = ${minIndex} (val: ${nums[minIndex]}). Array split into [0 .. ${minIndex - 1}] and [${minIndex} .. ${n - 1}].`,
    { PIVOT: minIndex },
    {
      phase: "1. Pivot Found",
      minIndex: `${minIndex} (val: ${nums[minIndex]})`,
      result: `Pivot at index ${minIndex}`,
    },
    { matchIndex: minIndex },
  );

  // ==========================================
  // PHASE 2: Select Subarray
  // ==========================================
  const lastVal = nums[n - 1];
  const minVal = nums[minIndex];
  const isInRightSubarray = target >= minVal && target <= lastVal;

  if (isInRightSubarray) {
    left = minIndex;
    right = n - 1;
    buildFrame(
      "Phase 2: Target in Right Segment",
      11,
      `target (${target}) is in range [${minVal} .. ${lastVal}] -> Belongs in right sorted segment [${left} .. ${right}].`,
      { LEFT: left, RIGHT: right },
      {
        phase: "2. Segment Selected",
        segment: `[${left} .. ${right}]`,
        left,
        right,
      },
    );
  } else {
    left = 0;
    right = Math.max(0, minIndex - 1);
    buildFrame(
      "Phase 2: Target in Left Segment",
      13,
      `target (${target}) does not belong in right segment -> Belongs in left sorted segment [${left} .. ${right}].`,
      { LEFT: left, RIGHT: right },
      {
        phase: "2. Segment Selected",
        segment: `[${left} .. ${right}]`,
        left,
        right,
      },
    );
  }

  // ==========================================
  // PHASE 3: Standard Binary Search
  // ==========================================
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midVal = nums[mid];

    buildFrame(
      "Phase 3: Binary Search",
      18,
      `mid = ⌊(${left} + ${right}) / 2⌋ = ${mid}. nums[mid] = ${midVal}, target = ${target}.`,
      { LEFT: left, MID: mid, RIGHT: right },
      {
        phase: "3. Binary Search",
        left,
        right,
        mid,
        "nums[mid]": midVal,
        result: "Evaluating",
      },
      { activeIndex: mid },
    );

    if (midVal === target) {
      buildFrame(
        "★ Target Found!",
        19,
        `Exact match! nums[${mid}] === ${target}. Returning index ${mid}.`,
        { MATCH: mid },
        { phase: "3. Target Found", mid, result: `Found at Index ${mid}` },
        { matchIndex: mid },
      );
      return builder.getFrames();
    } else if (midVal < target) {
      buildFrame(
        "nums[mid] < target",
        20,
        `nums[${mid}] (${midVal}) < target (${target}). Target is to the right. Set left = mid + 1 = ${mid + 1}.`,
        { LEFT: left, MID: mid, RIGHT: right },
        { phase: "3. Binary Search", left, right, mid, action: `left = ${mid + 1}` },
      );
      left = mid + 1;
    } else {
      buildFrame(
        "nums[mid] > target",
        21,
        `nums[${mid}] (${midVal}) > target (${target}). Target is to the left. Set right = mid - 1 = ${mid - 1}.`,
        { LEFT: left, MID: mid, RIGHT: right },
        { phase: "3. Binary Search", left, right, mid, action: `right = ${mid - 1}` },
      );
      right = mid - 1;
    }
  }

  buildFrame(
    "Target Not Found",
    23,
    `Search range exhausted (left > right). Target ${target} does not exist in array. Returning -1.`,
    {},
    { phase: "Target Not Found", result: "-1 (Not Found)" },
  );

  return builder.getFrames();
}

export default generateFrames;
