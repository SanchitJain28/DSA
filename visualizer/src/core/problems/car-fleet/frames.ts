import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { toArrayState } from "../../structures/array/helpers";
import { toStackState } from "../../structures/stack/helpers";

export function generateFrames(data: {
  target: number;
  position: number[];
  speed: number[];
}): Scene[] {
  const { target, position, speed } = data;
  const builder = new FrameBuilder<Scene>();

  const cars = position
    .map((pos, i) => ({ pos, spd: speed[i] }))
    .sort((a, b) => b.pos - a.pos);

  const stack: (number | string)[] = [];

  const buildFrame = (
    phase: string,
    codeLine: number,
    explanation: string,
    activeCarIdx: number | null,
    variables: Record<string, string | number> = {},
  ) => {
    const arrayPointers: Record<string, number> = {};
    if (activeCarIdx !== null && activeCarIdx >= 0 && activeCarIdx < cars.length) {
      arrayPointers["CAR"] = activeCarIdx;
    }

    builder.pushFrame({
      phase,
      codeLine,
      explanation,
      structures: {
        array: toArrayState(
          cars.map((c) => `[p:${c.pos}, s:${c.spd}]`),
          {
            name: "Cars (Sorted by Position Descending)",
            pointers: arrayPointers,
            activeIndex: activeCarIdx !== null ? activeCarIdx : undefined,
          },
        ),
        stack: toStackState([...stack], {
          name: "Fleet Arrival Times",
          topPointer: stack.length > 0,
        }),
      },
      variables: {
        target: `${target} miles`,
        "fleets count": stack.length,
        ...variables,
      },
    });
  };

  buildFrame(
    "Initialization",
    2,
    `Combine position and speed arrays, then sort cars by position in descending order (closest to target first).`,
    null,
  );

  buildFrame(
    "Init Stack",
    4,
    "Initialize empty stack to track unique fleet arrival times.",
    null,
  );

  for (let i = 0; i < cars.length; i++) {
    const { pos, spd } = cars[i];
    const time = (target - pos) / spd;

    buildFrame(
      "Process Car",
      5,
      `Inspecting car at position ${pos} with speed ${spd} mph.`,
      i,
      { i, pos, spd },
    );

    buildFrame(
      "Calculate Arrival Time",
      6,
      `Time to target = (target - pos) / speed = (${target} - ${pos}) / ${spd} = ${time} hrs.`,
      i,
      { i, pos, spd, time: `${time} hrs` },
    );

    if (stack.length === 0) {
      stack.push(time);
      buildFrame(
        "Create Fleet",
        8,
        `Stack is empty. Pushed arrival time ${time} hrs as the first leading fleet.`,
        i,
        { i, pos, spd, time: `${time} hrs`, action: `new fleet (${time} hrs)` },
      );
    } else {
      const topTime = stack[stack.length - 1] as number;

      buildFrame(
        "Compare With Fleet Ahead",
        7,
        `Comparing current car time (${time} hrs) with fleet ahead (${topTime} hrs).`,
        i,
        { i, time: `${time} hrs`, topTime: `${topTime} hrs` },
      );

      if (time > topTime) {
        stack.push(time);
        buildFrame(
          "New Slower Fleet",
          8,
          `Current car takes longer (${time} > ${topTime} hrs). It can never catch up, forming a new fleet behind.`,
          i,
          {
            i,
            time: `${time} hrs`,
            topTime: `${topTime} hrs`,
            action: `new fleet (${time} hrs)`,
          },
        );
      } else {
        buildFrame(
          "Joins Fleet Ahead",
          9,
          `Current car arrives faster or simultaneously (${time} <= ${topTime} hrs). It catches up and merges into the fleet ahead.`,
          i,
          {
            i,
            time: `${time} hrs`,
            topTime: `${topTime} hrs`,
            action: `merged with fleet (${topTime} hrs)`,
          },
        );
      }
    }
  }

  buildFrame(
    "Finished",
    11,
    `All cars processed. Total number of car fleets formed is ${stack.length}. Returning ${stack.length}.`,
    null,
    { result: `${stack.length} fleets` },
  );

  return builder.getFrames();
}

export default generateFrames;
