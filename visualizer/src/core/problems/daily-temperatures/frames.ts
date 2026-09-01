import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { toStackState } from "../../structures/stack/helpers";
import type { ArrayData } from "../../structures/array/types";

export function generateFrames(data: { temps: number[] }): Scene[] {
  const temperatures = data.temps;
  const builder = new FrameBuilder<Scene>();

  const stack: number[] = [];
  const result: number[] = new Array(temperatures.length).fill(0);

  const buildFrame = (
    phase: string,
    codeLine: number,
    explanation: string,
    currentI?: number,
    pointers: Record<string, number> = {},
    variables: Record<string, string | number> = {},
  ) => {
    const tempPointers: Record<string, number> = {};
    if (currentI !== undefined) tempPointers["i"] = currentI;
    if (pointers.top !== undefined) tempPointers["top"] = pointers.top;

    const arrays: ArrayData[] = [
      {
        id: "temperatures",
        name: "Temperatures",
        values: [...temperatures],
        pointers: tempPointers,
        activeIndex: currentI,
      },
      {
        id: "result",
        name: "Result (Wait Days)",
        values: [...result],
        pointers: pointers.popped !== undefined ? { updated: pointers.popped } : {},
        matchIndex: pointers.popped,
      },
    ];

    const stackValues = stack.map((idx) => `${idx} (${temperatures[idx]}°)`);

    builder.pushFrame({
      phase,
      codeLine,
      explanation,
      structures: {
        arrays,
        stack: toStackState(stackValues, {
          name: "Monotonic Stack (Indices)",
          topPointer: stack.length > 0,
        }),
      },
      variables: {
        i: currentI !== undefined ? currentI : "N/A",
        currentTemp: currentI !== undefined ? `${temperatures[currentI]}°` : "N/A",
        "stack.length": stack.length,
        ...variables,
      },
    });
  };

  buildFrame("Initialization", 2, "Initialize empty monotonic stack to store indices.", undefined);
  buildFrame("Init Result Array", 3, "Initialize result array with zeros.", undefined);

  for (let i = 0; i < temperatures.length; i++) {
    const currentTemp = temperatures[i];

    buildFrame(
      "Process Day",
      4,
      `Processing day ${i} with temperature ${currentTemp}°.`,
      i,
    );

    while (
      stack.length > 0 &&
      temperatures[stack[stack.length - 1]] < currentTemp
    ) {
      const topIdx = stack[stack.length - 1];
      buildFrame(
        "Warmer Day Found",
        6,
        `Stack top day ${topIdx} (${temperatures[topIdx]}°) is colder than current day ${i} (${currentTemp}°)!`,
        i,
        { top: topIdx },
      );

      const poppedIndex = stack.pop()!;
      buildFrame(
        "Pop Stack",
        7,
        `Popped day ${poppedIndex} from stack.`,
        i,
        { popped: poppedIndex },
      );

      const daysWait = i - poppedIndex;
      result[poppedIndex] = daysWait;

      buildFrame(
        "Update Result",
        8,
        `Day ${poppedIndex} waited ${daysWait} day(s) for a warmer temperature on day ${i}. result[${poppedIndex}] = ${daysWait}.`,
        i,
        { popped: poppedIndex },
        { prevDay: poppedIndex, daysWait },
      );
    }

    if (stack.length > 0) {
      const topIdx = stack[stack.length - 1];
      buildFrame(
        "Colder/Equal Condition",
        6,
        `Stack top day ${topIdx} (${temperatures[topIdx]}°) >= current day ${i} (${currentTemp}°). Condition false.`,
        i,
        { top: topIdx },
      );
    }

    stack.push(i);
    buildFrame(
      "Push to Stack",
      10,
      `Pushed day index ${i} (${currentTemp}°) onto the stack.`,
      i,
    );
  }

  buildFrame(
    "Finished",
    12,
    `Finished processing all temperatures. Remaining elements in stack have no warmer future days (default 0). Returning result.`,
    undefined,
    {},
    { result: `[${result.join(", ")}]` },
  );

  return builder.getFrames();
}

export default generateFrames;
