import type { StackFrame, StackData } from "../types";
import type { ArrayData } from "../../array/types";
import { FrameBuilder } from "../../shared/FrameBuilder";

export function generateFrames(target: number, position: number[], speed: number[]): StackFrame[] {
  const builder = new FrameBuilder<StackFrame>();
  
  // Parse cars array
  const cars = position
    .map((pos, i) => ({ pos, spd: speed[i] }))
    .sort((a, b) => b.pos - a.pos);

  const stack: number[] = [];

  const buildState = (activeCarIdx: number | null): { arrays: ArrayData[], stacks: StackData[] } => {
    const arrays: ArrayData[] = [{
      id: "cars",
      name: "cars [pos, spd]",
      // Display as string "[pos, spd]" in the array boxes
      values: cars.map(c => `[${c.pos}, ${c.spd}]`),
      pointers: activeCarIdx !== null ? { i: activeCarIdx } : {}
    }];

    const stacks: StackData[] = [{
      id: "fleet-times",
      name: "fleet arrival times",
      values: [...stack],
      topPointer: stack.length > 0
    }];

    return { arrays, stacks };
  };

  builder.pushFrame({
    phase: "Initialization",
    codeLine: 2,
    message: "Combine position and speed, then sort cars by position in descending order.",
    ...buildState(null),
    variables: { target, i: "N/A", pos: "N/A", spd: "N/A", time: "N/A" }
  });

  builder.pushFrame({
    phase: "Stack Initialization",
    codeLine: 6,
    message: "Initialize empty stack to track car fleet arrival times.",
    ...buildState(null),
    variables: { target, i: "N/A", pos: "N/A", spd: "N/A", time: "N/A" }
  });

  builder.executeCall(`carFleet(${target}, [${position}], [${speed}])`, () => {
    
    for (let i = 0; i < cars.length; i++) {
      const { pos, spd } = cars[i];

      builder.pushFrame({
        activeNodeIds: [`cars-${i}`],
        phase: "Process Car",
        codeLine: 8,
        message: `Processing car at position ${pos} with speed ${spd}.`,
        ...buildState(i),
        variables: { target, i, pos, spd, time: "N/A" }
      });

      const time = (target - pos) / spd;

      builder.pushFrame({
        activeNodeIds: [`cars-${i}`],
        phase: "Calculate Time",
        codeLine: 9,
        message: `Time to target = (${target} - ${pos}) / ${spd} = ${time}`,
        ...buildState(i),
        variables: { target, i, pos, spd, time }
      });

      if (!stack.length) {
        stack.push(time);
        builder.pushFrame({
          activeNodeIds: [`fleet-times-${stack.length - 1}`],
          phase: "Create Fleet",
          codeLine: 10,
          message: `Stack is empty. Pushing arrival time ${time} as a new fleet.`,
          ...buildState(i),
          variables: { target, i, pos, spd, time }
        });
      } else {
        const topTime = stack[stack.length - 1];
        builder.pushFrame({
          activeNodeIds: [`fleet-times-${stack.length - 1}`],
          phase: "Compare Time",
          codeLine: 10,
          message: `Comparing current time ${time} with fleet ahead (time ${topTime}).`,
          ...buildState(i),
          variables: { target, i, pos, spd, time, topTime }
        });

        if (time > topTime) {
          stack.push(time);
          builder.pushFrame({
            activeNodeIds: [`fleet-times-${stack.length - 1}`],
            phase: "Create Fleet",
            codeLine: 10,
            message: `Current car takes longer (${time} > ${topTime}). It forms a new fleet behind.`,
            ...buildState(i),
            variables: { target, i, pos, spd, time, topTime }
          });
        } else {
          builder.pushFrame({
            activeNodeIds: [`cars-${i}`],
            phase: "Join Fleet",
            codeLine: 10,
            message: `Current car arrives faster or at same time (${time} <= ${topTime}). It will join the fleet ahead.`,
            ...buildState(i),
            variables: { target, i, pos, spd, time, topTime }
          });
        }
      }
    }

  });

  builder.pushFrame({
    phase: "Finished",
    codeLine: 12,
    message: `All cars processed. Number of fleets is stack.length = ${stack.length}.`,
    ...buildState(null),
    variables: { target }
  });

  return builder.getFrames();
}
