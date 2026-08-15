import { FrameBuilder } from "../../shared/FrameBuilder";
import type { ArrayFrame, ArrayData } from "../types";

export function generateFrames(s: string, p: string): ArrayFrame[] {
  const builder = new FrameBuilder<ArrayFrame>();
  const map = new Map<string, number>();

  const sArr = s.split("");
  const pArr = p.split("");
  
  let i = 0; // Pointer for s
  let j = 0; // Pointer for p

  const buildFrame = (phase: string, codeLine: number, message: string, activeS: boolean, variables: Record<string, string> = {}) => {
    const hashMapObj = Object.fromEntries(map.entries());

    const sPointers: Record<string, number> = {};
    if (activeS && i < sArr.length) {
      sPointers["i"] = i;
    }

    const pPointers: Record<string, number> = {};
    if (!activeS && j < pArr.length) {
      pPointers["j"] = j;
    }

    const arrays: ArrayData[] = [
      {
        id: "s",
        name: "String s",
        values: [...sArr],
        pointers: sPointers,
      },
      {
        id: "p",
        name: "String p",
        values: [...pArr],
        pointers: pPointers,
      }
    ];

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
    message: "Starting isAnagram function.",
    variables: { ch: "N/A" },
    hashMap: {},
    arrays: [
      {
        id: "s",
        name: "String s",
        values: [...sArr],
        pointers: {},
      },
      {
        id: "p",
        name: "String p",
        values: [...pArr],
        pointers: {},
      }
    ],
  });

  builder.executeCall(`isAnagramOptimized("${s}", "${p}")`, () => {
    buildFrame("Init", 2, "Initialize a hash map to track character frequencies from string s.", true);

    for (i = 0; i < sArr.length; i++) {
      const ch = sArr[i];
      const loopVars = { ch: `"${ch}"` };
      
      buildFrame("Looping s", 3, `Processing character "${ch}" from s.`, true, loopVars);
      
      map.set(ch, (map.get(ch) ?? 0) + 1);
      
      buildFrame("Update Map", 3, `Incremented frequency of "${ch}" in the map.`, true, loopVars);
    }

    buildFrame("Finished s", 4, "Finished counting characters in string s. Now we will check string p.", false);

    for (j = 0; j < pArr.length; j++) {
      const ch = pArr[j];
      const loopVars = { ch: `"${ch}"` };
      
      buildFrame("Looping p", 4, `Processing character "${ch}" from p.`, false, loopVars);

      if (map.has(ch)) {
        buildFrame("Found in Map", 5, `The character "${ch}" exists in our map.`, false, loopVars);
        let value = map.get(ch)! - 1;
        
        buildFrame("Decrement", 6, `Decremented its count to ${value}.`, false, { ...loopVars, value: String(value) });

        if (value === 0) {
          map.delete(ch);
          buildFrame("Delete from Map", 7, `The count for "${ch}" is now 0, so we delete it from the map.`, false, loopVars);
        } else {
          map.set(ch, value);
          buildFrame("Update Map", 7, `Updated the count for "${ch}" in the map.`, false, loopVars);
        }
      } else {
        buildFrame("Not in Map", 8, `The character "${ch}" is NOT in our map (or count reached 0 already). This means it's not an anagram! Returning false.`, false, loopVars);
        return;
      }
    }

    const isMatch = map.size === 0;
    j = pArr.length;
    buildFrame("Finished", 10, isMatch ? "Processed all characters and the map is empty. They are anagrams! Return true." : "Map is not empty, there are leftover characters. Return false.", false);
  });

  return builder.getFrames();
}
