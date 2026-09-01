import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { toSetState } from "../../structures/set/helpers";
import type { SetElementStatus } from "../../structures/set/types";

export function generateFrames(data: { nums: number[] }): Scene[] {
  const { nums } = data;
  const builder = new FrameBuilder<Scene>();

  if (nums.length === 0) {
    builder.pushFrame({
      phase: "Empty Array",
      codeLine: 2,
      explanation: "Array is empty. Returning maxSequence = 0.",
      structures: {
        set: toSetState([], { streakChain: [], bestStreak: [] }),
      },
      variables: {
        num: "null",
        isStart: "null",
        current: "null",
        length: 0,
        maxSequence: 0,
      },
    });
    return builder.getFrames();
  }

  const set = new Set(nums);
  const setElements = Array.from(set);
  let maxSequence = 0;
  let bestStreak: number[] = [];

  const getElementStatuses = (
    currentNum: number | null,
    currentStreak: number[],
  ): Record<number, SetElementStatus> => {
    const statuses: Record<number, SetElementStatus> = {};
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

  const buildFrame = (
    codeLine: number,
    phase: string,
    explanation: string,
    currentNum: number | null,
    currentStreak: number[],
    isStart: boolean | null,
    prevVal: number | null,
    current: number | null,
    length: number,
    customStatuses?: Record<number, SetElementStatus>,
  ) => {
    let isStartStr = "null";
    if (isStart !== null && prevVal !== null) {
      isStartStr = isStart ? `Yes (${prevVal} ∉ Set)` : `No (${prevVal} ∈ Set)`;
    }

    builder.pushFrame({
      phase,
      codeLine,
      explanation,
      structures: {
        set: toSetState(setElements, {
          elementStatuses: customStatuses || getElementStatuses(currentNum, currentStreak),
          streakChain: currentStreak,
          bestStreak,
        }),
      },
      variables: {
        num: currentNum !== null ? currentNum : "null",
        isStart: isStartStr,
        current: current !== null ? current : "null",
        length,
        maxSequence,
      },
    });
  };

  buildFrame(
    3,
    "Initialize Set",
    `Constructed Hash Set with ${setElements.length} unique elements: {${setElements.join(", ")}}.`,
    null,
    [],
    null,
    null,
    null,
    0,
  );

  for (const num of setElements) {
    const prev = num - 1;
    const hasPrev = set.has(prev);
    const isStart = !hasPrev;

    buildFrame(
      6,
      "Check Sequence Start",
      `Inspecting num = ${num}. Checking if predecessor ${prev} exists in set: ${
        hasPrev ? `Yes (${prev} ∈ Set)` : `No (${prev} ∉ Set)`
      }.`,
      num,
      [],
      isStart,
      prev,
      null,
      0,
    );

    if (hasPrev) {
      const skippedStatuses = {
        ...getElementStatuses(num, []),
        [num]: "skipped" as SetElementStatus,
      };
      buildFrame(
        6,
        "Skip Non-Start",
        `${num} is not the start of a sequence because predecessor ${prev} is in the set. Skipping.`,
        num,
        [],
        false,
        prev,
        null,
        0,
        skippedStatuses,
      );
      continue;
    }

    let current = num;
    let length = 1;
    let streak = [current];

    buildFrame(
      8,
      "Start Sequence",
      `${num} is a sequence start! Initialized current = ${current}, length = 1.`,
      num,
      streak,
      true,
      prev,
      current,
      length,
    );

    while (set.has(current + 1)) {
      const nextVal = current + 1;
      buildFrame(
        9,
        "Check Next Element",
        `Checking if next element ${nextVal} exists in set: Found!`,
        num,
        streak,
        true,
        prev,
        current,
        length,
      );

      current++;
      length++;
      streak = [...streak, current];

      buildFrame(
        11,
        "Extend Sequence",
        `Extended streak to ${current}. Current chain: [${streak.join(", ")}] (length = ${length}).`,
        num,
        streak,
        true,
        prev,
        current,
        length,
      );
    }

    const prevMax = maxSequence;
    if (length > maxSequence) {
      maxSequence = length;
      bestStreak = [...streak];
    }

    buildFrame(
      13,
      "Update Max Sequence",
      `Sequence from ${num} ended at ${current} (length ${length}). ${
        length > prevMax
          ? `New longest sequence found: ${length}!`
          : `maxSequence remains ${maxSequence}.`
      }`,
      num,
      streak,
      true,
      prev,
      current,
      length,
    );
  }

  buildFrame(
    16,
    "Complete",
    `Scan complete. Longest consecutive sequence has length ${maxSequence}: [${bestStreak.join(", ")}].`,
    null,
    [],
    null,
    null,
    null,
    maxSequence,
  );

  return builder.getFrames();
}

export default generateFrames;
