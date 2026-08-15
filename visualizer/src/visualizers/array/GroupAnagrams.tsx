import { useMemo } from "react";
import ArrayVisualizerLayout from "../../components/layout/ArrayVisualizerLayout";
import { generateFrames } from "../../core/array/frames/groupAnagramsFrames";
import { groupAnagramsCode } from "../../core/array/sourcecode/groupAnagrams";

export default function GroupAnagrams() {
  const frames = useMemo(() => {
    return generateFrames(["eat", "tea", "tan", "ate", "nat", "bat"]);
  }, []);

  return (
    <ArrayVisualizerLayout
      title="Group Anagrams"
      theme="violet"
      frames={frames}
      code={groupAnagramsCode}
    />
  );
}
