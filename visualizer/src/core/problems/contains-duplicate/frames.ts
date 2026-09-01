import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { toArrayState } from "../../structures/array/helpers";
import { setHash } from "../../structures/hashmap/helpers";

export function generateFrames(data: { nums: number[] }): Scene[] {
  const { nums } = data;
  const builder = new FrameBuilder<Scene>();
  let map: Record<number, boolean> = {};
  let i = 0;

  const buildFrame = (
    phase: string,
    codeLine: number,
    explanation: string,
    opts: { isDuplicate?: boolean } = {},
  ) => {
    builder.pushFrame({
      phase,
      codeLine,
      explanation,
      structures: {
        array: toArrayState(nums, {
          name: "nums",
          pointers: i < nums.length ? { i } : {},
          activeIndex: i < nums.length ? i : undefined,
          conflictIndex: opts.isDuplicate ? i : undefined,
        }),
        hashmap: {
          title: "Seen Numbers Map",
          entries: { ...map },
          conflictKey: opts.isDuplicate ? nums[i] : undefined,
        },
      },
      variables: {
        num: i < nums.length ? nums[i] : "N/A",
      },
    });
  };

  buildFrame("Initialization", 1, "Starting containsDuplicate function.");

  builder.executeCall(`containsDuplicate([${nums.join(", ")}])`, () => {
    buildFrame("Initialize Map", 2, "Initialize an empty hash map to store seen numbers.");

    for (i = 0; i < nums.length; i++) {
      const num = nums[i];
      buildFrame("Looping", 3, `Inspecting current number: ${num}.`);

      if (num in map) {
        buildFrame(
          "Found Duplicate",
          4,
          `The map already contains ${num}! Duplicate detected, returning true.`,
          { isDuplicate: true },
        );
        return true;
      }

      buildFrame("Check Map", 4, `The number ${num} is not in the map yet.`);

      map = setHash(map, num, true);
      buildFrame("Update Map", 7, `Add ${num} -> true to the map.`);
    }

    buildFrame("Loop Finished", 9, "Finished checking all numbers without duplicates. Return false.");
    return false;
  });

  return builder.getFrames();
}

export default generateFrames;
