import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { toArrayState } from "../../structures/array/helpers";
import { setHash, deleteHash } from "../../structures/hashmap/helpers";

export function generateFrames(data: { s: string; p: string }): Scene[] {
  const { s, p } = data;
  const builder = new FrameBuilder<Scene>();
  let map: Record<string, number> = {};

  const sArr = s.split("");
  const pArr = p.split("");

  let i = 0;
  let j = 0;

  const buildFrame = (
    phase: string,
    codeLine: number,
    explanation: string,
    activeS: boolean,
    variables: Record<string, string | number> = {},
    opts: { isConflict?: boolean } = {},
  ) => {
    builder.pushFrame({
      phase,
      codeLine,
      explanation,
      structures: {
        arrays: [
          toArrayState(sArr, {
            id: "s",
            name: "String s",
            pointers: activeS && i < sArr.length ? { i } : {},
            activeIndex: activeS && i < sArr.length ? i : undefined,
          }),
          toArrayState(pArr, {
            id: "p",
            name: "String p",
            pointers: !activeS && j < pArr.length ? { j } : {},
            activeIndex: !activeS && j < pArr.length ? j : undefined,
            conflictIndex: opts.isConflict ? j : undefined,
          }),
        ],
        hashmap: {
          title: "Character Frequency Map",
          entries: { ...map },
          conflictKey: opts.isConflict && j < pArr.length ? pArr[j] : undefined,
        },
      },
      variables: {
        ...variables,
      },
    });
  };

  buildFrame("Initialization", 1, "Starting isAnagram function.", true);

  builder.executeCall(`isAnagram("${s}", "${p}")`, () => {
    buildFrame("Init", 2, "Initialize a hash map to track character frequencies from string s.", true);

    for (i = 0; i < sArr.length; i++) {
      const ch = sArr[i];
      buildFrame("Looping s", 3, `Processing character "${ch}" from s.`, true, { ch });

      map = setHash(map, ch, (map[ch] ?? 0) + 1);
      buildFrame("Update Map", 4, `Incremented frequency of "${ch}" to ${map[ch]} in map.`, true, { ch });
    }

    buildFrame("Finished s", 6, "Finished counting characters in string s. Now decrementing with string p.", false);

    for (j = 0; j < pArr.length; j++) {
      const ch = pArr[j];
      buildFrame("Looping p", 6, `Processing character "${ch}" from p.`, false, { ch });

      if (ch in map && map[ch] > 0) {
        const count = map[ch] - 1;
        buildFrame("Found in Map", 8, `The character "${ch}" exists in map. Decrement count.`, false, { ch, count });

        if (count === 0) {
          map = deleteHash(map, ch);
          buildFrame("Delete from Map", 9, `Count for "${ch}" reached 0, removing key from map.`, false, { ch });
        } else {
          map = setHash(map, ch, count);
          buildFrame("Update Map", 10, `Updated count of "${ch}" to ${count} in map.`, false, { ch, count });
        }
      } else {
        buildFrame(
          "Not in Map",
          7,
          `Character "${ch}" is NOT in map (or count already 0). Strings are not anagrams! Return false.`,
          false,
          { ch },
          { isConflict: true },
        );
        return false;
      }
    }

    const isMatch = Object.keys(map).length === 0;
    buildFrame(
      "Finished",
      12,
      isMatch
        ? "All characters matched and map is empty. They are valid anagrams! Return true."
        : "Map is not empty, extra characters remain. Return false.",
      false,
    );
    return isMatch;
  });

  return builder.getFrames();
}

export default generateFrames;
