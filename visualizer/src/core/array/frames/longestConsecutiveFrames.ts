import { FrameBuilder } from "@/core/shared/FrameBuilder";

export interface LongestConsecutiveFrame {
  phase: string;
  codeLine: number;
  message: string;
  nums: number[];
  setElements: number[];
  currentNum: number | null;
  checkedPrev: number | null;
  isStart: boolean | null;
  currentStreak: number[];
  bestStreak: number[];
  maxSequence: number;
  variables: {
    num: string;
    isStart: string;
    current: string;
    length: string;
    maxSequence: string;
  };
  callStack: string[];
  elementStatuses: Record<number, "default" | "active" | "skipped" | "streak" | "bestStreak">;
}

export function generateFrames(nums: number[]): LongestConsecutiveFrame[] {
  const builder = new FrameBuilder<LongestConsecutiveFrame>();

  if (nums.length === 0) {
    builder.pushFrame({
      phase: "Empty Array",
      codeLine: 1,
      message: "Array is empty. Returning maxSequence = 0.",
      nums: [],
      setElements: [],
      currentNum: null,
      checkedPrev: null,
      isStart: null,
      currentStreak: [],
      bestStreak: [],
      maxSequence: 0,
      variables: {
        num: "null",
        isStart: "null",
        current: "null",
        length: "0",
        maxSequence: "0",
      },
      elementStatuses: {},
    });
    return builder.getFrames();
  }

  const set = new Set(nums);
  const setElements = Array.from(set);
  let maxSequence = 0;
  let bestStreak: number[] = [];

  const getElementStatuses = (
    currentNum: number | null,
    currentStreak: number[]
  ): Record<number, "default" | "active" | "skipped" | "streak" | "bestStreak"> => {
    const statuses: Record<number, "default" | "active" | "skipped" | "streak" | "bestStreak"> = {};
    for (const el of setElements) {
      if (currentStreak.includes(el)) {
        statuses[el] = "streak";
      } else if (el === currentNum) {
        statuses[el] = "active";
      } else if (bestStreak.includes(el)) {
        statuses[el] = "bestStreak";
      } else {
        statuses[el] = "default";
      }
    }
    return statuses;
  };

  const getVariables = (
    num: number | null,
    isStart: boolean | null,
    prevVal: number | null,
    current: number | null,
    length: number
  ) => {
    let isStartStr = "null";
    if (isStart !== null && prevVal !== null) {
      isStartStr = isStart ? `Yes (${prevVal} ∉ Set)` : `No (${prevVal} ∈ Set)`;
    }
    return {
      num: num !== null ? String(num) : "null",
      isStart: isStartStr,
      current: current !== null ? String(current) : "null",
      length: String(length),
      maxSequence: String(maxSequence),
    };
  };

  // 1. Initial State: Set creation
  builder.pushFrame({
    phase: "Initialize Set",
    codeLine: 2,
    message: `Constructed Hash Set with ${setElements.length} unique elements: {${setElements.join(", ")}}.`,
    nums,
    setElements,
    currentNum: null,
    checkedPrev: null,
    isStart: null,
    currentStreak: [],
    bestStreak: [],
    maxSequence: 0,
    variables: getVariables(null, null, null, null, 0),
    elementStatuses: getElementStatuses(null, []),
  });

  // 2. Loop through each number in set
  for (const num of setElements) {
    const prev = num - 1;
    const hasPrev = set.has(prev);
    const isStart = !hasPrev;

    builder.pushFrame({
      phase: "Check Sequence Start",
      codeLine: 6,
      message: `Inspecting num = ${num}. Checking if ${prev} exists in set: ${hasPrev ? `Yes (${prev} ∈ Set)` : `No (${prev} ∉ Set)`}.`,
      nums,
      setElements,
      currentNum: num,
      checkedPrev: prev,
      isStart,
      currentStreak: [],
      bestStreak,
      maxSequence,
      variables: getVariables(num, isStart, prev, null, 0),
      elementStatuses: {
        ...getElementStatuses(num, []),
        [num]: "active",
      },
    });

    if (hasPrev) {
      // Skipped because not start
      builder.pushFrame({
        phase: "Skip Non-Start",
        codeLine: 6,
        message: `${num} is not the start of a sequence because predecessor ${prev} is in the set. Skipping.`,
        nums,
        setElements,
        currentNum: num,
        checkedPrev: prev,
        isStart: false,
        currentStreak: [],
        bestStreak,
        maxSequence,
        variables: getVariables(num, false, prev, null, 0),
        elementStatuses: {
          ...getElementStatuses(num, []),
          [num]: "skipped",
        },
      });
      continue;
    }

    // Sequence start found!
    let current = num;
    let length = 1;
    let streak = [current];

    builder.pushFrame({
      phase: "Start Sequence",
      codeLine: 8,
      message: `${num} is a sequence start! Initialized current = ${current}, length = 1.`,
      nums,
      setElements,
      currentNum: num,
      checkedPrev: prev,
      isStart: true,
      currentStreak: streak,
      bestStreak,
      maxSequence,
      variables: getVariables(num, true, prev, current, length),
      elementStatuses: getElementStatuses(num, streak),
    });

    while (set.has(current + 1)) {
      const nextVal = current + 1;
      builder.pushFrame({
        phase: "Check Next Element",
        codeLine: 9,
        message: `Checking if next element ${nextVal} exists in set: Found!`,
        nums,
        setElements,
        currentNum: num,
        checkedPrev: prev,
        isStart: true,
        currentStreak: streak,
        bestStreak,
        maxSequence,
        variables: getVariables(num, true, prev, current, length),
        elementStatuses: getElementStatuses(num, streak),
      });

      current++;
      length++;
      streak = [...streak, current];

      builder.pushFrame({
        phase: "Extend Sequence",
        codeLine: 11,
        message: `Extended streak to ${current}. Current chain: [${streak.join(", ")}] (length = ${length}).`,
        nums,
        setElements,
        currentNum: num,
        checkedPrev: prev,
        isStart: true,
        currentStreak: streak,
        bestStreak,
        maxSequence,
        variables: getVariables(num, true, prev, current, length),
        elementStatuses: getElementStatuses(num, streak),
      });
    }

    // End of streak for this start
    const prevMax = maxSequence;
    if (length > maxSequence) {
      maxSequence = length;
      bestStreak = [...streak];
    }

    builder.pushFrame({
      phase: "Update Max Sequence",
      codeLine: 13,
      message: `Sequence from ${num} ended at ${current} (length ${length}). ${
        length > prevMax
          ? `New longest sequence found: ${length}!`
          : `maxSequence remains ${maxSequence}.`
      }`,
      nums,
      setElements,
      currentNum: num,
      checkedPrev: prev,
      isStart: true,
      currentStreak: streak,
      bestStreak,
      maxSequence,
      variables: getVariables(num, true, prev, current, length),
      elementStatuses: getElementStatuses(null, streak),
    });
  }

  // Final Complete frame
  builder.pushFrame({
    phase: "Complete",
    codeLine: 17,
    message: `Scan complete. Longest consecutive sequence has length ${maxSequence}: [${bestStreak.join(", ")}].`,
    nums,
    setElements,
    currentNum: null,
    checkedPrev: null,
    isStart: null,
    currentStreak: [],
    bestStreak,
    maxSequence,
    variables: getVariables(null, null, null, null, maxSequence),
    elementStatuses: getElementStatuses(null, bestStreak),
  });

  return builder.getFrames();
}
