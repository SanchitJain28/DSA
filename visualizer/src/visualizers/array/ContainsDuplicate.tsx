import { useMemo } from "react";
import ArrayVisualizerLayout from "../../components/layout/ArrayVisualizerLayout";
import { generateFrames } from "../../core/array/frames/containsDuplicateFrames";
import { containsDuplicateCode } from "../../core/array/sourcecode/containsDuplicate";

export default function ContainsDuplicate() {
  const frames = useMemo(() => {
    return generateFrames([1, 2, 3, 1]);
  }, []);

  return (
    <ArrayVisualizerLayout
      title="Contains Duplicate"
      theme="indigo"
      frames={frames}
      code={containsDuplicateCode}
    />
  );
}
