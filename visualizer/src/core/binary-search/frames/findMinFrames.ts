import { FrameBuilder } from "../../shared/FrameBuilder";
import type { BaseFrame } from "../../shared/types";
import type { ArrayData } from "../../array/types";

export interface FindMinFrame extends BaseFrame {
  nums: number[];
  leftIndex: number;
  rightIndex: number;
  midIndex: number | null;
  status: "init" | "searching" | "checking" | "shift_left" | "shift_right" | "found";
  eliminatedIndices: number[];
  arrays?: ArrayData[];
}

export function generateFrames(nums: number[]): FindMinFrame[] {
  const builder = new FrameBuilder<FindMinFrame>();
  const n = nums.length;

  const getEmptyVars = () => ({
    left: "0",
    right: String(Math.max(0, n - 1)),
    mid: "—",
    "nums[mid]": "—",
    "nums[right]": "—",
    comparison: "—",
    minVal: "Searching",
  });

  const makeArrays = (l: number, r: number, m: number | null): ArrayData[] => {
    const pointers: Record<string, number> = {};
    if (l >= 0 && l < n) pointers["LEFT"] = l;
    if (m !== null && m >= 0 && m < n) pointers["MID"] = m;
    if (r >= 0 && r < n) pointers["RIGHT"] = r;

    return [
      {
        id: "nums",
        name: "nums",
        values: [...nums],
        pointers,
      },
    ];
  };

  const getActiveNodeIds = (l: number, r: number, m: number | null) => {
    const ids: string[] = [];
    if (l >= 0 && l < n) ids.push(`nums-${l}`);
    if (m !== null && m >= 0 && m < n) ids.push(`nums-${m}`);
    if (r >= 0 && r < n) ids.push(`nums-${r}`);
    return ids;
  };

  if (n === 0) {
    builder.pushFrame({
      phase: "Empty Array",
      codeLine: 12,
      message: "Array is empty. No minimum element.",
      variables: {
        ...getEmptyVars(),
        minVal: "N/A",
      },
      nums,
      leftIndex: 0,
      rightIndex: -1,
      midIndex: null,
      status: "found",
      eliminatedIndices: [],
      arrays: makeArrays(-1, -1, null),
    });
    return builder.getFrames();
  }

  // Step 1: Initialization
  builder.pushFrame({
    phase: "Initialization",
    codeLine: 1,
    message: `Start binary search to find the minimum element in rotated sorted array of length ${n}.`,
    variables: getEmptyVars(),
    nums,
    leftIndex: 0,
    rightIndex: n - 1,
    midIndex: null,
    status: "init",
    eliminatedIndices: [],
    arrays: makeArrays(0, n - 1, null),
    activeNodeIds: getActiveNodeIds(0, n - 1, null),
  });

  // Step 2: Set Boundaries
  let left = 0;
  let right = n - 1;

  builder.pushFrame({
    phase: "Set Search Range",
    codeLine: 2,
    message: `Initialize pointers: left = 0 (val: ${nums[0]}), right = ${right} (val: ${nums[right]}).`,
    variables: {
      ...getEmptyVars(),
      left: "0",
      right: String(right),
      "nums[right]": String(nums[right]),
    },
    nums,
    leftIndex: left,
    rightIndex: right,
    midIndex: null,
    status: "init",
    eliminatedIndices: [],
    arrays: makeArrays(left, right, null),
    activeNodeIds: getActiveNodeIds(left, right, null),
  });

  const getEliminated = (l: number, r: number) => {
    const arr: number[] = [];
    for (let i = 0; i < l; i++) arr.push(i);
    for (let i = r + 1; i < n; i++) arr.push(i);
    return arr;
  };

  while (left < right) {
    // While loop condition
    builder.pushFrame({
      phase: `Binary Search [${left} .. ${right}]`,
      codeLine: 4,
      message: `Loop condition left < right holds (${left} < ${right}). Window size = ${right - left + 1}.`,
      variables: {
        left: String(left),
        right: String(right),
        mid: "—",
        "nums[mid]": "—",
        "nums[right]": String(nums[right]),
        comparison: "—",
        minVal: "Searching",
      },
      nums,
      leftIndex: left,
      rightIndex: right,
      midIndex: null,
      status: "searching",
      eliminatedIndices: getEliminated(left, right),
      arrays: makeArrays(left, right, null),
      activeNodeIds: getActiveNodeIds(left, right, null),
    });

    const mid = Math.floor((left + right) / 2);
    const midVal = nums[mid];
    const rightVal = nums[right];

    // Compute Mid
    builder.pushFrame({
      phase: `Compute Mid = ${mid}`,
      codeLine: 5,
      message: `mid = Math.floor((${left} + ${right}) / 2) = ${mid}. Inspect nums[mid] = ${midVal} vs nums[right] = ${rightVal}.`,
      variables: {
        left: String(left),
        right: String(right),
        mid: String(mid),
        "nums[mid]": String(midVal),
        "nums[right]": String(rightVal),
        comparison: "Comparing",
        minVal: "Evaluating",
      },
      nums,
      leftIndex: left,
      rightIndex: right,
      midIndex: mid,
      status: "checking",
      eliminatedIndices: getEliminated(left, right),
      arrays: makeArrays(left, right, mid),
      activeNodeIds: getActiveNodeIds(left, right, mid),
    });

    // Check condition: nums[mid] > nums[right]
    if (midVal > rightVal) {
      builder.pushFrame({
        phase: `nums[mid] (${midVal}) > nums[right] (${rightVal})`,
        codeLine: 6,
        message: `nums[${mid}] (${midVal}) > nums[${right}] (${rightVal}). The inflection point (drop) must be in the right half. Minimum is strictly to the right of mid.`,
        variables: {
          left: String(left),
          right: String(right),
          mid: String(mid),
          "nums[mid]": String(midVal),
          "nums[right]": String(rightVal),
          comparison: `${midVal} > ${rightVal} (Drop Right)`,
          minVal: "Min in right half",
        },
        nums,
        leftIndex: left,
        rightIndex: right,
        midIndex: mid,
        status: "shift_left",
        eliminatedIndices: getEliminated(left, right),
        arrays: makeArrays(left, right, mid),
        activeNodeIds: getActiveNodeIds(left, right, mid),
      });

      left = mid + 1;

      builder.pushFrame({
        phase: `Shift Left -> ${left}`,
        codeLine: 7,
        message: `Set left = mid + 1 = ${left}. Pruned indices 0 to ${mid}.`,
        variables: {
          left: String(left),
          right: String(right),
          mid: String(mid),
          "nums[mid]": String(midVal),
          "nums[right]": String(rightVal),
          comparison: `${midVal} > ${rightVal}`,
          minVal: "Searching",
        },
        nums,
        leftIndex: left,
        rightIndex: right,
        midIndex: mid,
        status: "searching",
        eliminatedIndices: getEliminated(left, right),
        arrays: makeArrays(left, right, mid),
        activeNodeIds: getActiveNodeIds(left, right, mid),
      });
    } else {
      builder.pushFrame({
        phase: `nums[mid] (${midVal}) <= nums[right] (${rightVal})`,
        codeLine: 8,
        message: `nums[${mid}] (${midVal}) <= nums[${right}] (${rightVal}). The right half is sorted. Minimum is at mid or in the left half.`,
        variables: {
          left: String(left),
          right: String(right),
          mid: String(mid),
          "nums[mid]": String(midVal),
          "nums[right]": String(rightVal),
          comparison: `${midVal} <= ${rightVal} (Right Sorted)`,
          minVal: "Min at mid or left",
        },
        nums,
        leftIndex: left,
        rightIndex: right,
        midIndex: mid,
        status: "shift_right",
        eliminatedIndices: getEliminated(left, right),
        arrays: makeArrays(left, right, mid),
        activeNodeIds: getActiveNodeIds(left, right, mid),
      });

      right = mid;

      builder.pushFrame({
        phase: `Shift Right -> ${right}`,
        codeLine: 9,
        message: `Set right = mid = ${right}. Pruned indices ${mid + 1} to ${n - 1}.`,
        variables: {
          left: String(left),
          right: String(right),
          mid: String(mid),
          "nums[mid]": String(midVal),
          "nums[right]": String(nums[right]),
          comparison: `${midVal} <= ${rightVal}`,
          minVal: "Searching",
        },
        nums,
        leftIndex: left,
        rightIndex: right,
        midIndex: mid,
        status: "searching",
        eliminatedIndices: getEliminated(left, right),
        arrays: makeArrays(left, right, mid),
        activeNodeIds: getActiveNodeIds(left, right, mid),
      });
    }
  }

  // Final convergence: left === right
  const minElement = nums[left];

  builder.pushFrame({
    phase: `★ Minimum Found: ${minElement}`,
    codeLine: 12,
    message: `Pointers converged at index left = right = ${left}. Minimum element is nums[${left}] = ${minElement}.`,
    variables: {
      left: String(left),
      right: String(right),
      mid: String(left),
      "nums[mid]": String(minElement),
      "nums[right]": String(minElement),
      comparison: `left === right (${left})`,
      minVal: String(minElement),
    },
    nums,
    leftIndex: left,
    rightIndex: right,
    midIndex: left,
    status: "found",
    eliminatedIndices: getEliminated(left, left),
    arrays: [
      {
        id: "nums",
        name: "nums",
        values: [...nums],
        pointers: {
          MIN: left,
        },
      },
    ],
    activeNodeIds: [`nums-${left}`],
  });

  return builder.getFrames();
}
