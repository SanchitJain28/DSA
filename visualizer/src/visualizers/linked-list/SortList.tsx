import { useMemo } from "react";
import { buildUnsortedList } from "../../core/linked-list/buildList";
import { sortListCode } from "../../core/linked-list/sourcecode/sortList";
import { generateFrames } from "../../core/linked-list/frames/sortListFrames";
import LinkedListVisualizerLayout from "../../components/layout/LinkedListVisualizerLayout";

export default function SortList() {
  const frames = useMemo(() => {
    const head = buildUnsortedList();
    return generateFrames(head);
  }, []);

  return (
    <LinkedListVisualizerLayout
      title="Sort List (Merge Sort)"
      theme="indigo"
      frames={frames}
      code={sortListCode}
    />
  );
}
