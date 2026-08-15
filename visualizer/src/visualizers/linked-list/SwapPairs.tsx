import { useMemo } from "react";
import LinkedListVisualizerLayout from "../../components/layout/LinkedListVisualizerLayout";
import { swapPairsCode } from "../../core/linked-list/sourcecode/swapPairs";
import { generateFrames } from "../../core/linked-list/frames/swapPairsFrames";

export default function SwapPairs() {
  const frames = useMemo(() => {
    return generateFrames([1, 2, 3, 4]);
  }, []);

  return (
    <LinkedListVisualizerLayout
      title="Swap Nodes in Pairs"
      theme="indigo"
      frames={frames}
      code={swapPairsCode}
    />
  );
}
