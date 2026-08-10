import { useMemo } from "react";
import StackVisualizerLayout from "../../components/layout/StackVisualizerLayout";
import { carFleetCode } from "../../core/stack/sourcecode/carFleet";
import { generateFrames } from "../../core/stack/frames/carFleetFrames";

export default function CarFleet() {
  const frames = useMemo(() => {
    const target = 12;
    const position = [10, 8, 0, 5, 3];
    const speed = [2, 4, 1, 1, 3];
    return generateFrames(target, position, speed);
  }, []);

  return (
    <StackVisualizerLayout
      title="Car Fleet"
      theme="indigo"
      frames={frames}
      code={carFleetCode}
    />
  );
}
