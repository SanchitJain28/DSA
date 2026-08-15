import { FrameBuilder } from "../../shared/FrameBuilder";
import type { ArrayFrame, ArrayData } from "../types";

export function generateFrames(nums: number[], target: number): ArrayFrame[] {
  const builder = new FrameBuilder<ArrayFrame>();
  const map = new Map<number, number>();
  
  let i = 0;

  const buildFrame = (phase: string, codeLine: number, message: string, variables: Record<string, string> = {}) => {
    const hashMapObj = Object.fromEntries(map.entries());

    const currentPointers: Record<string, number> = {};
    if (i < nums.length) {
      currentPointers["i"] = i;
    }

    const arrays: ArrayData[] = [
      {
        id: "nums",
        name: "Numbers Array",
        values: [...nums],
        pointers: currentPointers,
      }
    ];

    builder.pushFrame({
      phase,
      codeLine,
      message,
      variables: {
        target: String(target),
        ...variables,
      },
      hashMap: hashMapObj,
      arrays,
    });
  };

  builder.pushFrame({
    phase: "Initialization",
    codeLine: 1,
    message: `Starting twoSum function with target = ${target}.`,
    variables: { target: String(target), needed: "N/A" },
    hashMap: {},
    arrays: [
      {
        id: "nums",
        name: "Numbers Array",
        values: [...nums],
        pointers: {},
      }
    ]
  });

  builder.executeCall(`twoSum([${nums.join(", ")}], ${target})`, () => {
    buildFrame("Init Map", 2, "Initialize an empty hash map. It will store { value: index }.");

    for (i = 0; i < nums.length; i++) {
      const num = nums[i];
      buildFrame("Looping", 3, `Processing index ${i}, value = ${num}.`, { needed: "N/A" });
      
      const needed = target - num;
      const loopVars = { needed: String(needed) };
      
      buildFrame("Calculate Needed", 4, `We need ${needed} (${target} - ${num}) to reach the target.`, loopVars);

      if (map.has(needed)) {
        const matchingIndex = map.get(needed)!;
        buildFrame("Found Complement", 5, `We found ${needed} in our map! It's at index ${matchingIndex}.`, loopVars);
        
        buildFrame("Return Result", 6, `We return the indices [${matchingIndex}, ${i}].`, loopVars);
        return [matchingIndex, i];
      } else {
        buildFrame("Not Found", 7, `We did not find ${needed} in our map.`, loopVars);
        
        map.set(num, i);
        buildFrame("Update Map", 8, `Store the current value ${num} and its index ${i} in the map for future checks.`, loopVars);
      }
    }
    
    // We shouldn't reach here if a valid pair is guaranteed, but for completeness:
    buildFrame("Finished", 11, "No valid pair was found, returning [-1, -1].");
    return [-1, -1];
  });

  return builder.getFrames();
}
