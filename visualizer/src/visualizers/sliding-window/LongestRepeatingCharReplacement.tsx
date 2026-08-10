import { useMemo } from "react";
import SlidingWindowVisualizerLayout from "../../components/layout/SlidingWindowVisualizerLayout";
import { longestRepeatingCharReplacementCode } from "../../core/sliding-window/sourcecode/longestRepeatingCharReplacement";
import { generateFrames } from "../../core/sliding-window/frames/longestRepeatingCharReplacementFrames";

export default function LongestRepeatingCharReplacement() {
  const frames = useMemo(() => {
    return generateFrames("ABAB", 2);
  }, []);

  return (
    <SlidingWindowVisualizerLayout
      title="Longest Repeating Character Replacement"
      theme="indigo"
      frames={frames}
      code={longestRepeatingCharReplacementCode}
    />
  );
}
