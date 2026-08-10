import { useMemo } from "react";
import ArrayVisualizerLayout from "../../components/layout/ArrayVisualizerLayout";
import { sortedSquaresCode } from "../../core/array/sourcecode/sortedSquares";
import { generateFrames } from "../../core/array/frames/sortedSquaresFrames";

export default function SortedSquares() {
  const frames = useMemo(() => {
    const nums = [-4, -1, 0, 3, 10];
    return generateFrames(nums);
  }, []);

  return (
    <ArrayVisualizerLayout
      title="Squares of a Sorted Array"
      theme="sky"
      frames={frames}
      code={sortedSquaresCode}
    />
  );
}
