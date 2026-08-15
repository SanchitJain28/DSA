import { useMemo } from "react";
import ArrayVisualizerLayout from "../../components/layout/ArrayVisualizerLayout";
import { generateFrames } from "../../core/recursion/frames/reverseStringFrames";
import { reverseStringCode } from "../../core/recursion/sourcecode/reverseString";

export default function ReverseString() {
  const frames = useMemo(() => {
    return generateFrames("hello");
  }, []);

  return (
    <ArrayVisualizerLayout
      title="Reverse String"
      theme="indigo"
      frames={frames}
      code={reverseStringCode}
    />
  );
}
