import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { toArrayState } from "../../structures/array/helpers";
import { setHash } from "../../structures/hashmap/helpers";

export function generateFrames(data: { strs: string[] }): Scene[] {
  const { strs } = data;
  const builder = new FrameBuilder<Scene>();
  let map: Record<string, number> = {};
  const result: string[][] = [];
  let i = 0;

  const buildFrame = (
    phase: string,
    codeLine: number,
    explanation: string,
    variables: Record<string, string | number> = {},
    opts: { activeResultGroup?: number } = {},
  ) => {
    const arrays = [
      toArrayState(strs, {
        id: "strs",
        name: "Input Strings (strs)",
        pointers: i < strs.length ? { i } : {},
        activeIndex: i < strs.length ? i : undefined,
      }),
    ];

    if (result.length > 0) {
      arrays.push(
        toArrayState(
          result.map((group) => [...group]),
          {
            id: "result",
            name: "Grouped Anagrams (result)",
            activeIndex: opts.activeResultGroup,
            matchIndex: opts.activeResultGroup,
          },
        ),
      );
    }

    builder.pushFrame({
      phase,
      codeLine,
      explanation,
      structures: {
        arrays,
        hashmap: {
          title: "Sorted Key → Result Group Index",
          entries: { ...map },
          activeKey: variables.sortedString as string,
        },
      },
      variables: {
        ...variables,
        "result groups": result.length,
      },
    });
  };

  buildFrame("Initialization", 1, "Starting groupAnagrams function.", {
    str: "N/A",
    sortedString: "N/A",
  });

  builder.executeCall(`groupAnagrams([${strs.map((s) => `"${s}"`).join(", ")}])`, () => {
    buildFrame("Init", 2, "Initialize hash map to track sorted strings and group indices.");
    buildFrame("Init", 3, "Initialize result array to hold grouped anagram lists.");

    for (i = 0; i < strs.length; i++) {
      const str = strs[i];
      const sortedString = str.split("").sort().join("");
      const loopVars = { str: `"${str}"`, sortedString: `"${sortedString}"` };

      buildFrame("Looping", 4, `Processing string: "${str}".`, loopVars);
      buildFrame("Sort String", 5, `Sorted characters yield key: "${sortedString}".`, loopVars);

      if (sortedString in map) {
        const groupIdx = map[sortedString];
        buildFrame(
          "Check Map",
          6,
          `Map contains "${sortedString}". Append "${str}" to existing group ${groupIdx}.`,
          loopVars,
          { activeResultGroup: groupIdx },
        );
        result[groupIdx].push(str);
        buildFrame(
          "Append",
          7,
          `Appended "${str}" to group [${result[groupIdx].join(", ")}].`,
          loopVars,
          { activeResultGroup: groupIdx },
        );
      } else {
        const newGroupIdx = result.length;
        buildFrame(
          "Check Map",
          8,
          `Map does not contain "${sortedString}". Create new group at index ${newGroupIdx}.`,
          loopVars,
        );
        map = setHash(map, sortedString, newGroupIdx);
        result.push([str]);
        buildFrame(
          "Create Group",
          10,
          `Stored key "${sortedString}" -> ${newGroupIdx} and initialized new group with ["${str}"].`,
          loopVars,
          { activeResultGroup: newGroupIdx },
        );
      }
    }

    buildFrame("Finished", 13, `Processed all strings. Returning ${result.length} anagram groups.`, {
      str: "N/A",
      sortedString: "N/A",
    });
    return result;
  });

  return builder.getFrames();
}

export default generateFrames;
