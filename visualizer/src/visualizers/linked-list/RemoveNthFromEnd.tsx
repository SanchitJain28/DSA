import { useMemo } from "react";
import LinkedListVisualizerLayout from "../../components/layout/LinkedListVisualizerLayout";
import { removeNthFromEndCode } from "../../core/linked-list/sourcecode/removeNthFromEnd";
import { generateFrames } from "../../core/linked-list/frames/removeNthFromEndFrames";

export default function RemoveNthFromEnd() {
  const frames = useMemo(() => {
    return generateFrames([1, 2, 3, 4, 5], 2);
  }, []);

  return (
    <LinkedListVisualizerLayout
      title="Remove Nth Node From End"
      theme="teal"
      frames={frames}
      code={removeNthFromEndCode}
    />
  );
}
