import { FrameBuilder } from "../../shared/FrameBuilder";
import type { BaseFrame } from "../../shared/types";
import type { ArrayData } from "../../array/types";

export interface SearchRotatedFrame extends BaseFrame {
  nums: number[];
  target: number;
  leftIndex: number;
  rightIndex: number;
  midIndex: number | null;
  minIndex: number | null;
  status: "init" | "finding_pivot" | "pivot_found" | "segment_selected" | "searching" | "found" | "not_found";
  eliminatedIndices: number[];
  arrays?: ArrayData[];
}

export function generateFrames(nums: number[], target: number): SearchRotatedFrame[] {
  const builder = new FrameBuilder<SearchRotatedFrame>();
  const n = nums.length;

  const getEmptyVars = () => ({
    target: String(target),
    phase: "Initialization",
    minIndex: "—",
    left: "0",
    right: String(Math.max(0, n - 1)),
    mid: "—",
    "nums[mid]": "—",
    result: "Searching",
  });

  const makeArrays = (
    l: number,
    r: number,
    m: number | null,
    minIdx: number | null,
    foundIdx: number | null = null
  ): ArrayData[] => {
    const pointers: Record<string, number> = {};
    if (foundIdx !== null && foundIdx >= 0 && foundIdx < n) {
      pointers["MATCH"] = foundIdx;
    } else {
      if (l >= 0 && l < n) pointers["LEFT"] = l;
      if (m !== null && m >= 0 && m < n) pointers["MID"] = m;
      if (r >= 0 && r < n) pointers["RIGHT"] = r;
      if (minIdx !== null && minIdx >= 0 && minIdx < n && !pointers["MID"] && !pointers["LEFT"]) {
        pointers["MIN"] = minIdx;
      }
    }

    return [
      {
        id: "nums",
        name: "nums",
        values: [...nums],
        pointers,
      },
    ];
  };

  const getActiveNodeIds = (l: number, r: number, m: number | null, foundIdx: number | null = null) => {
    const ids: string[] = [];
    if (foundIdx !== null && foundIdx >= 0 && foundIdx < n) {
      ids.push(`nums-${foundIdx}`);
      return ids;
    }
    if (l >= 0 && l < n) ids.push(`nums-${l}`);
    if (m !== null && m >= 0 && m < n) ids.push(`nums-${m}`);
    if (r >= 0 && r < n) ids.push(`nums-${r}`);
    return ids;
  };

  if (n === 0) {
    builder.pushFrame({
      phase: "Empty Array",
      codeLine: 23,
      message: "Array is empty. Return -1.",
      variables: {
        ...getEmptyVars(),
        result: "-1 (Not Found)",
      },
      nums,
      target,
      leftIndex: 0,
      rightIndex: -1,
      midIndex: null,
      minIndex: null,
      status: "not_found",
      eliminatedIndices: [],
      arrays: makeArrays(-1, -1, null, null),
    });
    return builder.getFrames();
  }

  // Step 1: Initial Frame
  builder.pushFrame({
    phase: "Initialization",
    codeLine: 1,
    message: `Start search for target = ${target} in rotated sorted array of length ${n}.`,
    variables: getEmptyVars(),
    nums,
    target,
    leftIndex: 0,
    rightIndex: n - 1,
    midIndex: null,
    minIndex: null,
    status: "init",
    eliminatedIndices: [],
    arrays: makeArrays(0, n - 1, null, null),
    activeNodeIds: getActiveNodeIds(0, n - 1, null),
  });

  // ==========================================
  // PHASE 1: Find minIndex (Pivot)
  // ==========================================
  let left = 0;
  let right = n - 1;

  builder.pushFrame({
    phase: "Phase 1: Find Pivot (Min Index)",
    codeLine: 2,
    message: `Phase 1: Find minimum element index (pivot). Initialize left = 0, right = ${right}.`,
    variables: {
      ...getEmptyVars(),
      phase: "1. Find Pivot",
      left: "0",
      right: String(right),
    },
    nums,
    target,
    leftIndex: left,
    rightIndex: right,
    midIndex: null,
    minIndex: null,
    status: "finding_pivot",
    eliminatedIndices: [],
    arrays: makeArrays(left, right, null, null),
    activeNodeIds: getActiveNodeIds(left, right, null),
  });

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    const midVal = nums[mid];
    const rightVal = nums[right];

    builder.pushFrame({
      phase: "Phase 1: Check Mid",
      codeLine: 5,
      message: `mid = Math.floor((${left} + ${right}) / 2) = ${mid}. Compare nums[mid] (${midVal}) < nums[right] (${rightVal}).`,
      variables: {
        target: String(target),
        phase: "1. Find Pivot",
        minIndex: "—",
        left: String(left),
        right: String(right),
        mid: String(mid),
        "nums[mid]": String(midVal),
        result: `nums[mid]: ${midVal} vs nums[right]: ${rightVal}`,
      },
      nums,
      target,
      leftIndex: left,
      rightIndex: right,
      midIndex: mid,
      minIndex: null,
      status: "finding_pivot",
      eliminatedIndices: [],
      arrays: makeArrays(left, right, mid, null),
      activeNodeIds: getActiveNodeIds(left, right, mid),
    });

    if (midVal < rightVal) {
      right = mid;
      builder.pushFrame({
        phase: "Phase 1: Right Subarray Sorted",
        codeLine: 6,
        message: `nums[${mid}] (${midVal}) < nums[${right}] (${rightVal}) -> Right half is sorted. Minimum is at mid or to the left. Set right = mid = ${right}.`,
        variables: {
          target: String(target),
          phase: "1. Find Pivot",
          minIndex: "—",
          left: String(left),
          right: String(right),
          mid: String(mid),
          "nums[mid]": String(midVal),
          result: `right = ${right}`,
        },
        nums,
        target,
        leftIndex: left,
        rightIndex: right,
        midIndex: mid,
        minIndex: null,
        status: "finding_pivot",
        eliminatedIndices: [],
        arrays: makeArrays(left, right, mid, null),
        activeNodeIds: getActiveNodeIds(left, right, mid),
      });
    } else {
      left = mid + 1;
      builder.pushFrame({
        phase: "Phase 1: Inflection in Right Half",
        codeLine: 7,
        message: `nums[${mid}] (${midVal}) >= nums[${right}] (${rightVal}) -> Drop occurs in right half. Set left = mid + 1 = ${left}.`,
        variables: {
          target: String(target),
          phase: "1. Find Pivot",
          minIndex: "—",
          left: String(left),
          right: String(right),
          mid: String(mid),
          "nums[mid]": String(midVal),
          result: `left = ${left}`,
        },
        nums,
        target,
        leftIndex: left,
        rightIndex: right,
        midIndex: mid,
        minIndex: null,
        status: "finding_pivot",
        eliminatedIndices: [],
        arrays: makeArrays(left, right, mid, null),
        activeNodeIds: getActiveNodeIds(left, right, mid),
      });
    }
  }

  const minIndex = left;

  // Pivot found!
  builder.pushFrame({
    phase: `★ Pivot Found: Index ${minIndex}`,
    codeLine: 9,
    message: `Pivot found! minIndex = ${minIndex} (value: ${nums[minIndex]}). The array is split into two sorted subarrays: [0 .. ${minIndex - 1}] and [${minIndex} .. ${n - 1}].`,
    variables: {
      target: String(target),
      phase: "1. Pivot Found",
      minIndex: `${minIndex} (val: ${nums[minIndex]})`,
      left: String(left),
      right: String(right),
      mid: String(minIndex),
      "nums[mid]": String(nums[minIndex]),
      result: `Pivot at ${minIndex}`,
    },
    nums,
    target,
    leftIndex: left,
    rightIndex: right,
    midIndex: minIndex,
    minIndex: minIndex,
    status: "pivot_found",
    eliminatedIndices: [],
    arrays: makeArrays(minIndex, minIndex, minIndex, minIndex),
    activeNodeIds: [`nums-${minIndex}`],
  });

  // ==========================================
  // PHASE 2: Determine Subarray for Target
  // ==========================================
  const lastVal = nums[n - 1];
  const minVal = nums[minIndex];
  const isInRightSubarray = target >= minVal && target <= lastVal;

  if (isInRightSubarray) {
    left = minIndex;
    right = n - 1;
    builder.pushFrame({
      phase: "Phase 2: Target in Right Segment",
      codeLine: 10,
      message: `target (${target}) >= nums[${minIndex}] (${minVal}) && target <= nums[${n - 1}] (${lastVal}) -> Target belongs in right sorted segment [${left} .. ${right}].`,
      variables: {
        target: String(target),
        phase: "2. Segment Selected",
        minIndex: `${minIndex} (val: ${minVal})`,
        left: String(left),
        right: String(right),
        mid: "—",
        "nums[mid]": "—",
        result: `Search [${left} .. ${right}]`,
      },
      nums,
      target,
      leftIndex: left,
      rightIndex: right,
      midIndex: null,
      minIndex: minIndex,
      status: "segment_selected",
      eliminatedIndices: Array.from({ length: minIndex }, (_, i) => i),
      arrays: makeArrays(left, right, null, minIndex),
      activeNodeIds: getActiveNodeIds(left, right, null),
    });
  } else {
    left = 0;
    right = minIndex - 1;
    builder.pushFrame({
      phase: "Phase 2: Target in Left Segment",
      codeLine: 13,
      message: `target (${target}) does not belong in right segment -> Target belongs in left sorted segment [${left} .. ${Math.max(0, right)}].`,
      variables: {
        target: String(target),
        phase: "2. Segment Selected",
        minIndex: `${minIndex} (val: ${minVal})`,
        left: String(left),
        right: String(right),
        mid: "—",
        "nums[mid]": "—",
        result: `Search [${left} .. ${right}]`,
      },
      nums,
      target,
      leftIndex: left,
      rightIndex: right,
      midIndex: null,
      minIndex: minIndex,
      status: "segment_selected",
      eliminatedIndices: Array.from({ length: n - minIndex }, (_, i) => minIndex + i),
      arrays: makeArrays(left, right, null, minIndex),
      activeNodeIds: getActiveNodeIds(left, right, null),
    });
  }

  // ==========================================
  // PHASE 3: Standard Binary Search
  // ==========================================
  const getEliminatedP3 = (l: number, r: number) => {
    const arr: number[] = [];
    for (let i = 0; i < l; i++) arr.push(i);
    for (let i = r + 1; i < n; i++) arr.push(i);
    return arr;
  };

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midVal = nums[mid];

    builder.pushFrame({
      phase: `Phase 3: Binary Search (Mid = ${mid})`,
      codeLine: 18,
      message: `mid = Math.floor((${left} + ${right}) / 2) = ${mid}. nums[mid] = ${midVal}, target = ${target}.`,
      variables: {
        target: String(target),
        phase: "3. Binary Search",
        minIndex: `${minIndex} (val: ${minVal})`,
        left: String(left),
        right: String(right),
        mid: String(mid),
        "nums[mid]": String(midVal),
        result: "Evaluating",
      },
      nums,
      target,
      leftIndex: left,
      rightIndex: right,
      midIndex: mid,
      minIndex: minIndex,
      status: "searching",
      eliminatedIndices: getEliminatedP3(left, right),
      arrays: makeArrays(left, right, mid, minIndex),
      activeNodeIds: getActiveNodeIds(left, right, mid),
    });

    if (midVal < target) {
      builder.pushFrame({
        phase: `nums[mid] (${midVal}) < ${target}`,
        codeLine: 19,
        message: `nums[${mid}] (${midVal}) < target (${target}). Target must be to the right. Set left = mid + 1 = ${mid + 1}.`,
        variables: {
          target: String(target),
          phase: "3. Binary Search",
          minIndex: `${minIndex} (val: ${minVal})`,
          left: String(left),
          right: String(right),
          mid: String(mid),
          "nums[mid]": String(midVal),
          result: `${midVal} < ${target}`,
        },
        nums,
        target,
        leftIndex: left,
        rightIndex: right,
        midIndex: mid,
        minIndex: minIndex,
        status: "searching",
        eliminatedIndices: getEliminatedP3(left, right),
        arrays: makeArrays(left, right, mid, minIndex),
        activeNodeIds: getActiveNodeIds(left, right, mid),
      });
      left = mid + 1;
    } else if (midVal > target) {
      builder.pushFrame({
        phase: `nums[mid] (${midVal}) > ${target}`,
        codeLine: 20,
        message: `nums[${mid}] (${midVal}) > target (${target}). Target must be to the left. Set right = mid - 1 = ${mid - 1}.`,
        variables: {
          target: String(target),
          phase: "3. Binary Search",
          minIndex: `${minIndex} (val: ${minVal})`,
          left: String(left),
          right: String(right),
          mid: String(mid),
          "nums[mid]": String(midVal),
          result: `${midVal} > ${target}`,
        },
        nums,
        target,
        leftIndex: left,
        rightIndex: right,
        midIndex: mid,
        minIndex: minIndex,
        status: "searching",
        eliminatedIndices: getEliminatedP3(left, right),
        arrays: makeArrays(left, right, mid, minIndex),
        activeNodeIds: getActiveNodeIds(left, right, mid),
      });
      right = mid - 1;
    } else {
      // Match found!
      builder.pushFrame({
        phase: `★ Target Found at Index ${mid}!`,
        codeLine: 21,
        message: `Match found! nums[${mid}] === target (${target}). Returning index ${mid}.`,
        variables: {
          target: String(target),
          phase: "3. Match Found",
          minIndex: `${minIndex} (val: ${minVal})`,
          left: String(left),
          right: String(right),
          mid: String(mid),
          "nums[mid]": String(midVal),
          result: `Found at Index ${mid}`,
        },
        nums,
        target,
        leftIndex: left,
        rightIndex: right,
        midIndex: mid,
        minIndex: minIndex,
        status: "found",
        eliminatedIndices: getEliminatedP3(mid, mid),
        arrays: makeArrays(mid, mid, mid, minIndex, mid),
        activeNodeIds: [`nums-${mid}`],
      });
      return builder.getFrames();
    }
  }

  // Not Found
  builder.pushFrame({
    phase: "Target Not Found",
    codeLine: 23,
    message: `Search range exhausted (left > right). Target ${target} does not exist in array. Returning -1.`,
    variables: {
      target: String(target),
      phase: "Finished",
      minIndex: `${minIndex} (val: ${minVal})`,
      left: String(left),
      right: String(right),
      mid: "—",
      "nums[mid]": "—",
      result: "-1 (Not Found)",
    },
    nums,
    target,
    leftIndex: left,
    rightIndex: right,
    midIndex: null,
    minIndex: minIndex,
    status: "not_found",
    eliminatedIndices: Array.from({ length: n }, (_, i) => i),
    arrays: makeArrays(-1, -1, null, minIndex),
  });

  return builder.getFrames();
}
