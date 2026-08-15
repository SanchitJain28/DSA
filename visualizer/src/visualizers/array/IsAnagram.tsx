import { useMemo } from "react";
import ArrayVisualizerLayout from "../../components/layout/ArrayVisualizerLayout";
import { generateFrames } from "../../core/array/frames/isAnagramFrames";
import { isAnagramCode } from "../../core/array/sourcecode/isAnagram";

export default function IsAnagram() {
  const frames = useMemo(() => {
    return generateFrames("anagram", "nagaram");
  }, []);

  return (
    <ArrayVisualizerLayout
      title="Valid Anagram"
      theme="sky"
      frames={frames}
      code={isAnagramCode}
    />
  );
}
