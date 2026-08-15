import { useMemo } from "react";
import ArrayVisualizerLayout from "../../components/layout/ArrayVisualizerLayout";
import { generateFrames } from "../../core/array/frames/twoSumFrames";
import { twoSumCode } from "../../core/array/sourcecode/twoSum";

export default function TwoSum() {
  const frames = useMemo(() => {
    return generateFrames([3, 4, 5, 6], 7);
  }, []);

  return (
    <ArrayVisualizerLayout
      title="Two Sum"
      theme="violet"
      frames={frames}
      code={twoSumCode}
    />
  );
}
