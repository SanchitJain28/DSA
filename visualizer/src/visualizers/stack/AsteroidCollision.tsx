import { useMemo } from "react";
import StackVisualizerLayout from "../../components/layout/StackVisualizerLayout";
import { asteroidCollisionCode } from "../../core/stack/sourcecode/asteroidCollision";
import { generateFrames } from "../../core/stack/frames/asteroidCollisionFrames";

export default function AsteroidCollision() {
  const frames = useMemo(() => {
    const asteroids = [5, 10, -5]; // Default input array for asteroid collision
    return generateFrames(asteroids);
  }, []);

  return (
    <StackVisualizerLayout
      title="Asteroid Collision"
      theme="orange"
      frames={frames}
      code={asteroidCollisionCode}
    />
  );
}
