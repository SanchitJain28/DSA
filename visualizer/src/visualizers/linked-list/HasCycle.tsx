import { useMemo } from "react";
import LinkedListVisualizerLayout from "../../components/layout/LinkedListVisualizerLayout";
import { generateHasCycleFrames } from "../../core/linked-list/frames/hasCycleFrames";
import { hasCycleCode } from "../../core/linked-list/sourcecode/hasCycle";

export default function HasCycle() {
  const frames = useMemo(() => generateHasCycleFrames(), []);

  return (
    <LinkedListVisualizerLayout
      title="Linked List Cycle"
      theme="teal"
      frames={frames}
      code={hasCycleCode}
    />
  );
}
