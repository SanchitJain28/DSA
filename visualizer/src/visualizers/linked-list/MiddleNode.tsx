import { useMemo } from "react";
import LinkedListVisualizerLayout from "../../components/layout/LinkedListVisualizerLayout";
import { middleNodeCode } from "../../core/linked-list/sourcecode/middleNode";
import { generateFrames } from "../../core/linked-list/frames/middleNodeFrames";

export default function MiddleNode() {
  const frames = useMemo(() => {
    return generateFrames([1, 2, 3, 4, 5, 6]);
  }, []);

  return (
    <LinkedListVisualizerLayout
      title="Middle of the Linked List"
      theme="emerald"
      frames={frames}
      code={middleNodeCode}
    />
  );
}
