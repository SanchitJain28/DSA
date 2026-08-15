import { FrameBuilder } from "../../shared/FrameBuilder";
import type { ArrayFrame } from "../types";

export function generateFrames(nums: number[]): ArrayFrame[] {
  const builder = new FrameBuilder<ArrayFrame>();
  
  const map = new Map<number, boolean>();
  let i = 0;

  const buildFrame = (phase: string, codeLine: number, message: string) => {
    const hashMapObj = Object.fromEntries(map.entries());

    const currentPointers: Record<string, number> = {};
    if (i < nums.length) {
      currentPointers["i"] = i;
    }

    const arrays = [
      {
        id: "nums",
        name: "nums",
        values: [...nums],
        pointers: currentPointers,
      }
    ];

    builder.pushFrame({
      phase,
      codeLine,
      message,
      variables: {
        num: i < nums.length ? String(nums[i]) : "N/A",
      },
      hashMap: hashMapObj,
      arrays,
    });
  };

  builder.pushFrame({
    phase: "Initialization",
    codeLine: 1,
    message: "Starting containsDuplicate function.",
    variables: { num: "N/A" },
    hashMap: {},
    arrays: [
      {
        id: "nums",
        name: "nums",
        values: [...nums],
        pointers: {},
      }
    ],
  });

  builder.executeCall(`containsDuplicate([${nums.join(", ")}])`, () => {
    buildFrame("Initialize Map", 2, "Initialize an empty hash map to store seen numbers.");

    for (i = 0; i < nums.length; i++) {
      const num = nums[i];
      buildFrame("Looping", 3, `Check the current number: ${num}.`);

      if (map.has(num)) {
        buildFrame("Found Duplicate", 4, `The map already contains ${num}! We found a duplicate, so we return true.`);
        return;
      }
      buildFrame("Check Map", 4, `The map does not contain ${num}.`);

      map.set(num, true);
      buildFrame("Update Map", 5, `Add ${num} to the map so we can remember it.`);
    }

    buildFrame("Loop Finished", 7, "We finished checking all numbers and didn't find any duplicates. Return false.");
  });

  return builder.getFrames();
}
