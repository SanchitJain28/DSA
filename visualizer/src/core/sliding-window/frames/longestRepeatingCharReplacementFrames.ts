import { FrameBuilder } from "../../shared/FrameBuilder";
import type { SlidingWindowData, SlidingWindowFrame } from "../types";

export function generateFrames(s: string, k: number): SlidingWindowFrame[] {
  const builder = new FrameBuilder<SlidingWindowFrame>();

  const freq = new Map<string, number>();
  let maxFreq = 0;
  let longestSub = 0;
  let left = 0;
  let right = 0;

  const getFreqString = () => {
    let str = "{ ";
    for (const [char, count] of freq.entries()) {
      str += `${char}: ${count}, `;
    }
    return str.replace(/, $/, "") + " }";
  };

  const buildState = (): { arrays: SlidingWindowData[] } => {
    return {
      arrays: [
        {
          id: "string",
          name: "s",
          values: s.split(""),
          pointers: { L: left, R: right },
          windows: [
            {
              start: left,
              end: right,
            },
          ],
        },
      ],
    };
  };

  builder.pushFrame({
    phase: "Initialization",
    codeLine: 2,
    message: `Initialize frequency map, maxFreq, longestSub, left, and right pointers. k = ${k}`,
    ...buildState(),
    variables: { k, left, right, maxFreq, longestSub, freq: getFreqString() },
  });

  builder.executeCall(`characterReplacement("${s}", ${k})`, () => {
    while (right < s.length) {
      const ch = s[right];

      builder.pushFrame({
        activeNodeIds: [`string-${right}`],
        phase: "Expand Window",
        codeLine: 8,
        message: `Right pointer at ${right}, character is '${ch}'.`,
        ...buildState(),
        variables: {
          k,
          left,
          right,
          maxFreq,
          longestSub,
          ch,
          freq: getFreqString(),
        },
      });

      freq.set(ch, (freq.get(ch) || 0) + 1);
      maxFreq = Math.max(maxFreq, freq.get(ch)!);

      builder.pushFrame({
        activeNodeIds: [`string-${right}`],
        phase: "Update Frequencies",
        codeLine: 10,
        message: `Increment freq['${ch}'] to ${freq.get(ch)}. maxFreq becomes ${maxFreq}.`,
        ...buildState(),
        variables: {
          k,
          left,
          right,
          maxFreq,
          longestSub,
          ch,
          freq: getFreqString(),
        },
      });

      const currentWindowLen = right - left + 1;

      builder.pushFrame({
        activeNodeIds: [`string-${right}`],
        phase: "Check Condition",
        codeLine: 11,
        message: `Check if replacements needed: window_len (${currentWindowLen}) - maxFreq (${maxFreq}) = ${currentWindowLen - maxFreq}. Is it > k (${k})?`,
        ...buildState(),
        variables: {
          k,
          left,
          right,
          maxFreq,
          longestSub,
          ch,
          window_len: currentWindowLen,
          freq: getFreqString(),
        },
      });

      while (right - left + 1 - maxFreq > k) {
        const leftCh = s[left];
        freq.set(leftCh, freq.get(leftCh)! - 1);
        left++;

        builder.pushFrame({
          activeNodeIds: [`string-${left - 1}`], // highlights the one that was removed
          phase: "Shrink Window",
          codeLine: 13,
          message: `Too many replacements needed. Decrement freq['${leftCh}'] to ${freq.get(leftCh)} and advance left pointer.`,
          ...buildState(),
          variables: {
            k,
            left,
            right,
            maxFreq,
            longestSub,
            ch,
            leftCh,
            freq: getFreqString(),
          },
        });
      }

      const newWindowLen = right - left + 1;
      longestSub = Math.max(longestSub, newWindowLen);

      builder.pushFrame({
        phase: "Update Longest Substring",
        codeLine: 16,
        message: `Current valid window is [${left}, ${right}]. Update longestSub to max(${longestSub}, ${newWindowLen}) = ${longestSub}.`,
        ...buildState(),
        variables: {
          k,
          left,
          right,
          maxFreq,
          longestSub,
          freq: getFreqString(),
        },
      });

      right++;
      if (right < s.length) {
        builder.pushFrame({
          phase: "Advance Right",
          codeLine: 17,
          message: `Advance right pointer.`,
          ...buildState(), // right is already advanced here, so window visually jumps to include it (which is good)
          variables: {
            k,
            left,
            right,
            maxFreq,
            longestSub,
            freq: getFreqString(),
          },
        });
      }
    }
  });

  builder.pushFrame({
    phase: "Finished",
    codeLine: 19,
    message: `Reached end of string. Returning longestSub = ${longestSub}.`,
    ...buildState(),
    variables: {
      k,
      left,
      right: right - 1,
      maxFreq,
      longestSub,
      freq: getFreqString(),
    },
  });

  return builder.getFrames();
}
