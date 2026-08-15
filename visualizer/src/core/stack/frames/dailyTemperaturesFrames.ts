import { FrameBuilder } from "../../shared/FrameBuilder";
import type { StackFrame } from "../types";

export function generateFrames(temperatures: number[]): StackFrame[] {
  const builder = new FrameBuilder<StackFrame>();
  
  const stack: number[] = [];
  const result: number[] = new Array(temperatures.length).fill(0);

  const getBaseFrame = (
    codeLine: number,
    phase: string,
    message: string,
    currentI?: number,
    pointers?: Record<string, number>
  ) => {
    const allPointers: Record<string, number> = {};
    if (currentI !== undefined) allPointers["i"] = currentI;
    if (pointers) {
      Object.assign(allPointers, pointers);
    }
    
    // Convert stack to string representation of "idx (temp)" for better visualization
    const stackValues = stack.map(idx => `${idx} (${temperatures[idx]}°)`);

    return {
      phase,
      codeLine,
      message,
      variables: {
        i: currentI !== undefined ? currentI.toString() : "undefined",
        "stack.length": stack.length.toString(),
      },
      arrays: [
        {
          id: "temperatures",
          name: "Temperatures",
          values: [...temperatures],
          pointers: allPointers,
        },
        {
          id: "result",
          name: "Result",
          values: [...result],
        },
      ],
      stacks: [
        {
          id: "stack",
          name: "Monotonic Stack (Indices)",
          values: stackValues,
          topPointer: stack.length > 0
        }
      ]
    };
  };

  builder.pushFrame(
    getBaseFrame(2, "Initialization", "Initialize empty stack.")
  );

  builder.pushFrame(
    getBaseFrame(3, "Initialization", "Initialize result array with zeros.")
  );

  for (let i = 0; i < temperatures.length; i++) {
    builder.pushFrame(
      getBaseFrame(4, "Outer Loop", `Process day ${i} with temperature ${temperatures[i]}°.`, i)
    );

    while (
      stack.length &&
      temperatures[stack[stack.length - 1]] < temperatures[i]
    ) {
      const topIdx = stack[stack.length - 1];
      builder.pushFrame(
        getBaseFrame(
          7,
          "While Condition",
          `Stack is not empty. Top is day ${topIdx} (${temperatures[topIdx]}°). ${temperatures[i]}° is warmer!`,
          i,
          { "top": topIdx }
        )
      );

      const poppedIndex = stack.pop()!;
      builder.pushFrame(
        getBaseFrame(
          9,
          "Pop Stack",
          `Pop day ${poppedIndex} from stack.`,
          i,
          { "popped": poppedIndex }
        )
      );

      const daysWait = i - poppedIndex;
      result[poppedIndex] = daysWait;
      builder.pushFrame(
        getBaseFrame(
          10,
          "Update Result",
          `Day ${poppedIndex} had to wait ${daysWait} days for a warmer temperature.`,
          i,
          { "popped": poppedIndex }
        )
      );
    }

    if (stack.length > 0) {
      const topIdx = stack[stack.length - 1];
      builder.pushFrame(
        getBaseFrame(
          7,
          "While Condition",
          `Top is day ${topIdx} (${temperatures[topIdx]}°), which is >= ${temperatures[i]}°. Condition false.`,
          i,
          { "top": topIdx }
        )
      );
    } else {
      builder.pushFrame(
        getBaseFrame(
          6,
          "While Condition",
          `Stack is empty.`,
          i
        )
      );
    }

    stack.push(i);
    builder.pushFrame(
      getBaseFrame(
        12,
        "Push to Stack",
        `Push day ${i} onto the stack.`,
        i
      )
    );
  }

  builder.pushFrame(
    getBaseFrame(
      14,
      "Return",
      "Finished processing all days. Return result array."
    )
  );

  return builder.getFrames();
}
