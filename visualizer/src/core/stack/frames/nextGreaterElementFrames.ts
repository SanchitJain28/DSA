import type { StackFrame } from "../types";
import { FrameBuilder } from "../../shared/FrameBuilder";

export function generateFrames(nums1: number[], nums2: number[]): StackFrame[] {
  const builder = new FrameBuilder<StackFrame>();

  const nextGreater = new Map<number, number>();
  const stack: number[] = [];
  const ans: number[] = [];

  const buildFrame = (
    phase: string,
    codeLine: number,
    message: string,
    pointers: Record<string, number> = {},
    ansArray: number[] = []
  ) => {
    // Format the map nicely for the variables panel
    const mapEntries = Array.from(nextGreater.entries())
      .map(([k, v]) => `${k} \u2192 ${v}`)
      .join(", ");
      
    builder.pushFrame({
      phase,
      codeLine,
      message,
      variables: {
        num: pointers["i"] !== undefined ? String(nums2[pointers["i"]]) : "N/A",
        nextGreater: mapEntries ? `{ ${mapEntries} }` : "{ }",
      },
      activeNodeId: null,
      arrays: [
        {
          id: "nums2",
          name: "nums2",
          values: [...nums2],
          pointers: pointers,
        },
        {
          id: "nums1",
          name: "nums1",
          values: [...nums1],
        },
        {
          id: "ans",
          name: "ans",
          values: ansArray.length > 0 ? [...ansArray] : Array(nums1.length).fill(""),
        }
      ],
      stacks: [
        {
          id: "stack",
          name: "Stack",
          values: [...stack],
          topPointer: true,
        },
      ],
    });
  };

  builder.executeCall(`nextGreaterElement([${nums1}], [${nums2}])`, () => {
    buildFrame(
      "Initialization",
      2,
      "Initialize an empty map to store the next greater element for each number."
    );
    buildFrame(
      "Initialization",
      3,
      "Initialize an empty stack to keep track of elements whose next greater element is not yet found."
    );

    for (let i = 0; i < nums2.length; i++) {
      const num = nums2[i];
      buildFrame(
        "Iterate nums2",
        5,
        `Current number is ${num}.`,
        { i }
      );

      buildFrame(
        "Check Stack",
        6,
        stack.length === 0 
          ? `Stack is empty. No previous elements to compare.`
          : `Is stack top (${stack[stack.length - 1]}) < current num (${num})? ${stack[stack.length - 1] < num ? "Yes!" : "No."}`,
        { i }
      );

      while (stack.length && stack[stack.length - 1] < num) {
        const poppedValue = stack.pop()!;
        buildFrame(
          "Pop Stack",
          7,
          `Pop ${poppedValue} from the stack because ${poppedValue} < ${num}. We found the next greater element for ${poppedValue}!`,
          { i }
        );

        nextGreater.set(poppedValue, num);
        buildFrame(
          "Update Map",
          8,
          `Record in map: next greater element for ${poppedValue} is ${num}.`,
          { i }
        );

        buildFrame(
          "Check Stack",
          6,
          stack.length === 0 
            ? `Stack is now empty.`
            : `Is stack top (${stack[stack.length - 1]}) < current num (${num})? ${stack[stack.length - 1] < num ? "Yes!" : "No."}`,
          { i }
        );
      }

      stack.push(num);
      buildFrame(
        "Push Stack",
        10,
        `Push ${num} onto the stack to find its next greater element later.`,
        { i }
      );
    }

    buildFrame(
      "Build Result",
      13,
      "Now construct the result array for nums1. If a number is in our map, we use the mapped value. Otherwise, we use -1."
    );

    for (let j = 0; j < nums1.length; j++) {
      const num1 = nums1[j];
      const greater = nextGreater.get(num1) ?? -1;
      ans.push(greater);
      buildFrame(
        "Build Result",
        13,
        `For nums1[${j}] = ${num1}, the next greater element is ${greater}.`,
        {},
        ans
      );
    }
  });

  return builder.getFrames();
}
