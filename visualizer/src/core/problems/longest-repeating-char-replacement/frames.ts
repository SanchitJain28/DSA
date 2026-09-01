import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { toArrayState } from "../../structures/array/helpers";
import { toHashMapState } from "../../structures/hashmap/helpers";

export function generateFrames(data: { s: string; k: number }): Scene[] {
  const { s, k } = data;
  const builder = new FrameBuilder<Scene>();
  const chars = s.split("");

  const freq = new Map<string, number>();
  let maxFreq = 0;
  let longest = 0;
  let left = 0;

  const buildFrame = (
    phase: string,
    codeLine: number,
    explanation: string,
    right: number,
    variables: Record<string, string | number> = {},
  ) => {
    const mapEntries: Record<string, number> = {};
    for (const [ch, count] of freq.entries()) {
      if (count > 0) mapEntries[ch] = count;
    }

    const windowLen = right >= left ? right - left + 1 : 0;

    builder.pushFrame({
      phase,
      codeLine,
      explanation,
      structures: {
        array: toArrayState(chars, {
          name: "String Characters (s)",
          pointers: { L: left, R: Math.min(right, chars.length - 1) },
          windows: [
            {
              start: left,
              end: Math.min(right, chars.length - 1),
            },
          ],
        }),
        hashmap: toHashMapState(mapEntries, {
          title: "Window Frequencies",
        }),
      },
      variables: {
        k,
        left,
        right: Math.min(right, chars.length - 1),
        windowLen,
        maxFreq,
        replacementsNeeded: Math.max(0, windowLen - maxFreq),
        longest,
        ...variables,
      },
    });
  };

  buildFrame("Initialization", 2, `Initialize count map, maxFreq = 0, longest = 0, left = 0, k = ${k}.`, 0);

  for (let right = 0; right < chars.length; right++) {
    const ch = chars[right];

    buildFrame(
      "Expand Window",
      7,
      `Advance right pointer to index ${right} (character '${ch}'). Expanding window to [${left} .. ${right}].`,
      right,
      { ch },
    );

    freq.set(ch, (freq.get(ch) || 0) + 1);
    maxFreq = Math.max(maxFreq, freq.get(ch)!);

    buildFrame(
      "Update Frequencies",
      9,
      `Incremented count['${ch}'] to ${freq.get(ch)}. Updated maxFreq = ${maxFreq}.`,
      right,
      { ch, [`count['${ch}']`]: freq.get(ch)! },
    );

    const windowLen = right - left + 1;
    const replacementsNeeded = windowLen - maxFreq;

    buildFrame(
      "Check Validity",
      10,
      `Window [${left} .. ${right}] length = ${windowLen}, maxFreq = ${maxFreq}. Replacements needed = ${windowLen} - ${maxFreq} = ${replacementsNeeded}. (Allowed budget k = ${k}).`,
      right,
      {
        windowLen,
        replacementsNeeded,
        valid: replacementsNeeded <= k ? "YES" : "NO (Shrink needed)",
      },
    );

    while (right - left + 1 - maxFreq > k) {
      const leftCh = chars[left];
      freq.set(leftCh, freq.get(leftCh)! - 1);
      left++;

      buildFrame(
        "Shrink Window",
        12,
        `Replacements needed (${right - left + 2 - maxFreq}) > k (${k}). Decrement count['${leftCh}'] to ${freq.get(
          leftCh,
        )} and advance left pointer to ${left}.`,
        right,
        { left, leftCh, [`count['${leftCh}']`]: freq.get(leftCh)! },
      );
    }

    const validWindowLen = right - left + 1;
    longest = Math.max(longest, validWindowLen);

    buildFrame(
      "Update Longest",
      14,
      `Current valid window [${left} .. ${right}] has length ${validWindowLen}. longest = max(${longest}, ${validWindowLen}) = ${longest}.`,
      right,
      { validWindowLen, longest },
    );
  }

  buildFrame(
    "Finished",
    16,
    `Finished scanning string. Maximum repeating character substring length achievable with at most ${k} replacements is ${longest}. Returning ${longest}.`,
    chars.length - 1,
    { result: longest },
  );

  return builder.getFrames();
}

export default generateFrames;
