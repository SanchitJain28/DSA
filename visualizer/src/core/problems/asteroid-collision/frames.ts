import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { toArrayState } from "../../structures/array/helpers";
import { toStackState } from "../../structures/stack/helpers";

export function generateFrames(data: { asteroids: number[] }): Scene[] {
  const asteroids = data.asteroids;
  const builder = new FrameBuilder<Scene>();
  const stack: (number | string)[] = [];

  const buildFrame = (
    phase: string,
    codeLine: number,
    explanation: string,
    activeAstIdx: number | null,
    variables: Record<string, string | number> = {},
    opts: { conflictIndex?: number } = {},
  ) => {
    const arrayPointers: Record<string, number> = {};
    if (activeAstIdx !== null && activeAstIdx >= 0 && activeAstIdx < asteroids.length) {
      arrayPointers["AST"] = activeAstIdx;
    }

    builder.pushFrame({
      phase,
      codeLine,
      explanation,
      structures: {
        array: toArrayState(asteroids, {
          name: "Asteroids Lane (+ Right, - Left)",
          pointers: arrayPointers,
          activeIndex: activeAstIdx !== null ? activeAstIdx : undefined,
          conflictIndex: opts.conflictIndex,
        }),
        stack: toStackState([...stack], {
          name: "Surviving Space Stack",
          topPointer: stack.length > 0,
        }),
      },
      variables: {
        "stack.length": stack.length,
        ...variables,
      },
    });
  };

  buildFrame("Initialization", 2, "Initialize empty stack to track surviving asteroids.", null);

  for (let i = 0; i < asteroids.length; i++) {
    const a = asteroids[i];
    let destroyed = false;

    buildFrame(
      "Process Asteroid",
      3,
      `Processing asteroid ${a} (${a > 0 ? "moving right ➔" : "moving left ⬅"}) at index ${i}.`,
      i,
      { i, asteroid: a, destroyed: "false" },
    );

    while (
      stack.length > 0 &&
      a < 0 &&
      typeof stack[stack.length - 1] === "number" &&
      (stack[stack.length - 1] as number) > 0
    ) {
      const top = stack[stack.length - 1] as number;
      const abs = Math.abs(a);

      buildFrame(
        "Collision Imminent!",
        6,
        `Collision! Moving left (${a}) meets moving right top (+${top}).`,
        i,
        { i, asteroid: a, top, incomingAbs: abs },
        { conflictIndex: i },
      );

      if (top > abs) {
        destroyed = true;
        buildFrame(
          "Incoming Explodes 💥",
          9,
          `Top (+${top}) > incoming (${abs}). Incoming asteroid ${a} explodes!`,
          i,
          { i, asteroid: a, top, incomingAbs: abs, result: "Incoming Exploded" },
        );
        break;
      } else if (top === abs) {
        destroyed = true;
        stack.pop();
        buildFrame(
          "Mutual Annihilation 💥💥",
          13,
          `Top (+${top}) === incoming (${abs}). Both asteroids explode!`,
          i,
          { i, asteroid: a, top, incomingAbs: abs, result: "Both Exploded" },
        );
        break;
      } else {
        stack.pop();
        buildFrame(
          "Top Explodes 💥",
          16,
          `Incoming (${abs}) > top (+${top}). Top asteroid ${top} explodes and is popped from stack. Asteroid ${a} continues left!`,
          i,
          { i, asteroid: a, top, incomingAbs: abs, result: "Top Exploded" },
        );
      }
    }

    if (!destroyed) {
      stack.push(a);
      buildFrame(
        "Asteroid Survived",
        19,
        `Asteroid ${a} survived and is pushed onto stack.`,
        i,
        { i, asteroid: a, action: `pushed(${a})` },
      );
    } else {
      buildFrame(
        "Asteroid Destroyed",
        19,
        `Asteroid ${a} was destroyed. Moving to next.`,
        i,
        { i, asteroid: a, destroyed: "true" },
      );
    }
  }

  buildFrame(
    "Finished",
    21,
    `All asteroids processed. Surviving asteroids in stack: [${stack.join(", ")}].`,
    null,
    { result: `[${stack.join(", ")}]` },
  );

  return builder.getFrames();
}

export default generateFrames;
