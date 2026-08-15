import { useMemo } from "react";
import StackVisualizerLayout from "../../components/layout/StackVisualizerLayout";
import { generateFrames } from "../../core/stack/frames/nextGreaterElementFrames";
import { nextGreaterElementCode } from "../../core/stack/sourcecode/nextGreaterElement";

export default function NextGreaterElement() {
  const frames = useMemo(() => {
    return generateFrames([4, 1, 2], [1, 3, 4, 2]);
  }, []);

  return (
    <StackVisualizerLayout
      title="Next Greater Element I"
      theme="orange"
      frames={frames}
      code={nextGreaterElementCode}
    />
  );
}
