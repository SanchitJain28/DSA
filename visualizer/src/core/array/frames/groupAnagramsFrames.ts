import { FrameBuilder } from "../../shared/FrameBuilder";
import type { ArrayFrame, ArrayData } from "../types";

export function generateFrames(strs: string[]): ArrayFrame[] {
  const builder = new FrameBuilder<ArrayFrame>();
  
  const map = new Map<string, number>();
  const result: string[][] = [];
  let i = 0;

  const buildFrame = (phase: string, codeLine: number, message: string, variables: Record<string, string> = {}) => {
    const hashMapObj = Object.fromEntries(map.entries());

    const currentPointers: Record<string, number> = {};
    if (i < strs.length) {
      currentPointers["i"] = i;
    }

    const arrays: ArrayData[] = [
      {
        id: "strs",
        name: "strs",
        values: [...strs],
        pointers: currentPointers,
      }
    ];
    
    if (result.length > 0) {
      arrays.push({
        id: "result",
        name: "result",
        values: result.map(arr => [...arr]), // copy inner array
        pointers: {},
      });
    }

    builder.pushFrame({
      phase,
      codeLine,
      message,
      variables: {
        ...variables,
      },
      hashMap: hashMapObj,
      arrays,
    });
  };

  builder.pushFrame({
    phase: "Initialization",
    codeLine: 1,
    message: "Starting groupAnagrams function.",
    variables: { str: "N/A", sortedString: "N/A" },
    hashMap: {},
    arrays: [
      {
        id: "strs",
        name: "strs",
        values: [...strs],
        pointers: {},
      }
    ],
  });

  builder.executeCall(`groupAnagrams([${strs.map(s => `"${s}"`).join(", ")}])`, () => {
    buildFrame("Init", 2, "Initialize a hash map to track the sorted strings and their index in the result array.");
    buildFrame("Init", 3, "Initialize the result array.");

    for (i = 0; i < strs.length; i++) {
      const str = strs[i];
      const sortedString = str.split("").sort().join("");
      
      const loopVars = {
        str: `"${str}"`,
        sortedString: `"${sortedString}"`,
      };

      buildFrame("Looping", 4, `Processing string: "${str}".`, loopVars);
      buildFrame("Sort String", 5, `Sorted characters of "${str}" yield "${sortedString}".`, loopVars);

      if (map.has(sortedString)) {
        buildFrame("Check Map", 6, `The map contains "${sortedString}". We append "${str}" to the existing anagram group at index ${map.get(sortedString)}.`, loopVars);
        result[map.get(sortedString)!].push(str);
        buildFrame("Append", 6, `Appended "${str}" to group.`, loopVars);
      } else {
        buildFrame("Check Map", 7, `The map does not contain "${sortedString}". We create a new anagram group.`, loopVars);
        map.set(sortedString, result.length);
        result.push([str]);
        buildFrame("Update Maps", 9, `Added "${sortedString}" to map pointing to index ${result.length - 1} and created a new group with "${str}".`, loopVars);
      }
    }

    // Finished
    i = strs.length;
    buildFrame("Finished", 12, "Processed all strings. Returning result array.", {
      str: "N/A",
      sortedString: "N/A",
    });
  });

  return builder.getFrames();
}
