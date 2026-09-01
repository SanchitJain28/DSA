import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { toArrayState } from "../../structures/array/helpers";
import { setHash } from "../../structures/hashmap/helpers";

export function generateFrames(data: { nums: number[]; target: number }): Scene[] {
  const { nums, target } = data;
  const builder = new FrameBuilder<Scene>();
  let map: Record<number, number> = {};
  let i = 0;

  const buildFrame = (
    phase: string,
    codeLine: number,
    explanation: string,
    variables: Record<string, string | number> = {},
    opts: { matchIndex?: number } = {},
  ) => {
    builder.pushFrame({
      phase,
      codeLine,
      explanation,
      structures: {
        array: toArrayState(nums, {
          name: "Numbers Array",
          pointers: i < nums.length ? { i } : {},
          activeIndex: i < nums.length ? i : undefined,
          matchIndex: opts.matchIndex,
        }),
        hashmap: {
          title: "Lookup Map (Value → Index)",
          entries: { ...map },
          activeKey: opts.matchIndex !== undefined ? target - nums[i] : undefined,
        },
      },
      variables: {
        target,
        ...variables,
      },
    });
  };

  buildFrame("Initialization", 1, `Starting twoSum function with target = ${target}.`, {
    needed: "N/A",
  });

  builder.executeCall(`twoSum([${nums.join(", ")}], ${target})`, () => {
    buildFrame(
      "Init Map",
      2,
      "Initialize an empty hash map to store seen values and their indices.",
    );

    for (i = 0; i < nums.length; i++) {
      const num = nums[i];
      buildFrame("Looping", 3, `Processing index ${i}, value = ${num}.`, {
        needed: "N/A",
      });

      const needed = target - num;
      const loopVars = { needed };

      buildFrame(
        "Calculate Needed",
        4,
        `We need ${needed} (${target} - ${num}) to reach the target.`,
        loopVars,
      );

      if (needed in map) {
        const matchingIndex = map[needed];
        buildFrame(
          "Found Complement",
          5,
          `Found complement ${needed} in map at index ${matchingIndex}!`,
          loopVars,
          { matchIndex: matchingIndex },
        );

        buildFrame(
          "Return Result",
          6,
          `Return pair of indices [${matchingIndex}, ${i}].`,
          loopVars,
          { matchIndex: matchingIndex },
        );
        return [matchingIndex, i];
      }

      buildFrame("Not Found", 7, `Complement ${needed} not found in map yet.`, loopVars);

      map = setHash(map, num, i);
      buildFrame(
        "Update Map",
        8,
        `Store value ${num} → index ${i} in map for future lookups.`,
        loopVars,
      );
    }

    buildFrame("Finished", 10, "No valid pair found, returning [-1, -1].");
    return [-1, -1];
  });

  return builder.getFrames();
}

export default generateFrames;
