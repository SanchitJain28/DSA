import type { StackFrame, StackData } from "../types";
import type { ArrayData } from "../../array/types";
import { FrameBuilder } from "../../shared/FrameBuilder";

export function generateFrames(asteroids: number[]): StackFrame[] {
  const builder = new FrameBuilder<StackFrame>();

  const currentAsteroids = [...asteroids];
  const stack: number[] = [];

  let i = 0; // index of asteroid being processed

  const buildState = (
    activeAstIdx: number | null,
  ): { arrays: ArrayData[]; stacks: StackData[] } => {
    const arrays: ArrayData[] = [
      {
        id: "asteroids",
        name: "asteroids",
        values: [...currentAsteroids],
        pointers: activeAstIdx !== null ? { i: activeAstIdx } : {},
      },
    ];

    const stacks: StackData[] = [
      {
        id: "stack",
        name: "stack",
        values: [...stack],
        topPointer: stack.length > 0,
      },
    ];

    return { arrays, stacks };
  };

  builder.pushFrame({
    phase: "Initialization",
    codeLine: 2,
    message: "Initializing empty stack to track surviving asteroids.",
    ...buildState(null),
    variables: { i: "N/A", asteroid: "N/A" },
  });

  builder.executeCall(`asteroidCollision([${asteroids.join(",")}])`, () => {
    for (i = 0; i < currentAsteroids.length; i++) {
      const asteroid = currentAsteroids[i];
      let destroyed = false;

      builder.pushFrame({
        activeNodeIds: [`asteroids-${i}`],
        phase: "Process Asteroid",
        codeLine: 3,
        message: `Processing asteroid ${asteroid} at index ${i}.`,
        ...buildState(i),
        variables: { i, asteroid, destroyed: destroyed.toString() },
      });

      builder.pushFrame({
        activeNodeIds: [`asteroids-${i}`],
        phase: "Set Destroyed Flag",
        codeLine: 4,
        message: `Initialize destroyed flag to false.`,
        ...buildState(i),
        variables: { i, asteroid, destroyed: destroyed.toString() },
      });

      while (stack.length > 0 && asteroid < 0 && stack[stack.length - 1] > 0) {
        builder.pushFrame({
          activeNodeIds: [`asteroids-${i}`, `stack-${stack.length - 1}`],
          phase: "Collision Check",
          codeLine: 5,
          message: `Collision imminent! Incoming ${asteroid} (<0) meets Top ${stack[stack.length - 1]} (>0).`,
          ...buildState(i),
          variables: { i, asteroid, destroyed: destroyed.toString() },
        });

        const top = stack[stack.length - 1];
        const abs = Math.abs(asteroid);

        builder.pushFrame({
          activeNodeIds: [`asteroids-${i}`, `stack-${stack.length - 1}`],
          phase: "Evaluate Collision",
          codeLine: 7,
          message: `Comparing sizes: top = ${top}, incoming abs = ${abs}.`,
          ...buildState(i),
          variables: { i, asteroid, destroyed: destroyed.toString(), top, abs },
        });

        if (top > abs) {
          destroyed = true;
          builder.pushFrame({
            activeNodeIds: [
              `asteroids-${i}-explode`,
              `stack-${stack.length - 1}`,
            ],
            phase: "Incoming Explodes",
            codeLine: 9,
            message: `Top ${top} is larger than incoming ${abs}. Incoming asteroid explodes.`,
            ...buildState(i),
            variables: {
              i,
              asteroid,
              destroyed: destroyed.toString(),
              top,
              abs,
            },
          });

          builder.pushFrame({
            phase: "Break Loop",
            codeLine: 10,
            message: `Breaking out of collision loop.`,
            ...buildState(i),
            variables: {
              i,
              asteroid,
              destroyed: destroyed.toString(),
              top,
              abs,
            },
          });
          break;
        } else if (top === abs) {
          destroyed = true;
          builder.pushFrame({
            activeNodeIds: [
              `asteroids-${i}-explode`,
              `stack-${stack.length - 1}-explode`,
            ],
            phase: "Mutual Annihilation",
            codeLine: 12,
            message: `Top ${top} equals incoming ${abs}. Both asteroids explode.`,
            ...buildState(i),
            variables: {
              i,
              asteroid,
              destroyed: destroyed.toString(),
              top,
              abs,
            },
          });

          stack.pop();

          builder.pushFrame({
            phase: "Pop Top",
            codeLine: 13,
            message: `Popped top asteroid from stack.`,
            ...buildState(i),
            variables: {
              i,
              asteroid,
              destroyed: destroyed.toString(),
              top,
              abs,
            },
          });

          builder.pushFrame({
            phase: "Break Loop",
            codeLine: 14,
            message: `Breaking out of collision loop.`,
            ...buildState(i),
            variables: {
              i,
              asteroid,
              destroyed: destroyed.toString(),
              top,
              abs,
            },
          });
          break;
        } else {
          builder.pushFrame({
            activeNodeIds: [
              `asteroids-${i}`,
              `stack-${stack.length - 1}-explode`,
            ],
            phase: "Top Explodes",
            codeLine: 15,
            message: `Incoming ${abs} is larger than top ${top}. Top asteroid explodes.`,
            ...buildState(i),
            variables: {
              i,
              asteroid,
              destroyed: destroyed.toString(),
              top,
              abs,
            },
          });

          stack.pop();

          builder.pushFrame({
            activeNodeIds: [`asteroids-${i}`],
            phase: "Pop Top",
            codeLine: 15,
            message: `Popped top asteroid. Asteroid ${asteroid} will continue moving left.`,
            ...buildState(i),
            variables: {
              i,
              asteroid,
              destroyed: destroyed.toString(),
              top,
              abs,
            },
          });
        }
      }

      builder.pushFrame({
        phase: "End Collision Check",
        codeLine: 5,
        message:
          stack.length === 0 || asteroid >= 0 || stack[stack.length - 1] < 0
            ? `No more collisions possible for asteroid ${asteroid}.`
            : `Asteroid ${asteroid} was destroyed.`,
        ...buildState(i),
        variables: { i, asteroid, destroyed: destroyed.toString() },
      });

      if (!destroyed) {
        stack.push(asteroid);
        builder.pushFrame({
          activeNodeIds: [`stack-${stack.length - 1}`],
          phase: "Push Asteroid",
          codeLine: 17,
          message: `Asteroid ${asteroid} survived. Pushing to stack.`,
          ...buildState(i),
          variables: { i, asteroid, destroyed: destroyed.toString() },
        });
      } else {
        builder.pushFrame({
          phase: "Asteroid Destroyed",
          codeLine: 17,
          message: `Asteroid ${asteroid} was destroyed. Moving to next.`,
          ...buildState(i),
          variables: { i, asteroid, destroyed: destroyed.toString() },
        });
      }
    }
  });

  builder.pushFrame({
    phase: "Finished",
    codeLine: 19,
    message: "All asteroids processed. Returning the surviving stack.",
    ...buildState(currentAsteroids.length - 1),
    variables: { i: currentAsteroids.length - 1 },
  });

  return builder.getFrames();
}
