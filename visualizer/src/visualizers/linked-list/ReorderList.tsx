import { useMemo } from "react";
import LinkedListVisualizerLayout from "../../components/layout/LinkedListVisualizerLayout";
import { generateFrames } from "../../core/linked-list/frames/reorderListFrames";
import { reorderListCode } from "../../core/linked-list/sourcecode/reorderList";

export default function ReorderList() {
  const frames = useMemo(() => {
    // Example: L0 -> L1 -> L2 -> L3 -> L4 becomes L0 -> L4 -> L1 -> L3 -> L2
    return generateFrames([1, 2, 3, 4, 5]);
  }, []);

  return (
    <LinkedListVisualizerLayout
      title="Reorder List"
      theme="indigo"
      frames={frames}
      code={reorderListCode}
    />
  );
}
