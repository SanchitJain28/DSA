import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { toStackState } from "../../structures/stack/helpers";
import { toHashMapState } from "../../structures/hashmap/helpers";
import type { ArrayData } from "../../structures/array/types";

export function generateFrames(data: {
  nums1: number[];
  nums2: number[];
}): Scene[] {
  const { nums1, nums2 } = data;
  const builder = new FrameBuilder<Scene>();

  const nextGreater = new Map<number, number>();
  const stack: number[] = [];
  const ans: number[] = [];

  const buildFrame = (
    phase: string,
    codeLine: number,
    explanation: string,
    pointers2: Record<string, number> = {},
    pointers1: Record<string, number> = {},
    variables: Record<string, string | number> = {},
  ) => {
    const arrays: ArrayData[] = [
      {
        id: "nums2",
        name: "nums2 (Search Array)",
        values: [...nums2],
        pointers: pointers2,
      },
      {
        id: "nums1",
        name: "nums1 (Query Array)",
        values: [...nums1],
        pointers: pointers1,
      },
      {
        id: "ans",
        name: "ans (Result Array)",
        values:
          ans.length > 0 ? [...ans] : Array(nums1.length).fill(null),
        matchIndex: ans.length > 0 ? ans.length - 1 : undefined,
      },
    ];

    const mapEntries: Record<string, any> = {};
    for (const [k, v] of nextGreater.entries()) {
      mapEntries[k] = v;
    }

    builder.pushFrame({
      phase,
      codeLine,
      explanation,
      structures: {
        arrays,
        stack: toStackState([...stack], {
          name: "Monotonic Stack",
          topPointer: stack.length > 0,
        }),
        hashmap: toHashMapState(mapEntries, {
          title: "Next Greater Elements Map",
        }),
      },
      variables: {
        "stack.length": stack.length,
        ...variables,
      },
    });
  };

  buildFrame("Initialization", 2, "Initialize empty nextGreater map.");
  buildFrame("Initialize Stack", 3, "Initialize empty stack for elements looking for their next greater number.");

  for (let i = 0; i < nums2.length; i++) {
    const num = nums2[i];

    buildFrame(
      "Iterate nums2",
      5,
      `Inspecting nums2[${i}] = ${num}.`,
      { i },
      {},
      { num },
    );

    while (stack.length > 0 && stack[stack.length - 1] < num) {
      const poppedValue = stack.pop()!;

      buildFrame(
        "Pop Stack",
        7,
        `Stack top (${poppedValue}) < current num (${num}). Popped ${poppedValue}! Next greater element for ${poppedValue} is ${num}.`,
        { i },
        {},
        { num, popped: poppedValue },
      );

      nextGreater.set(poppedValue, num);

      buildFrame(
        "Update Map",
        8,
        `Recorded nextGreater.set(${poppedValue}, ${num}).`,
        { i },
        {},
        { num, [`nextGreater[${poppedValue}]`]: num },
      );
    }

    stack.push(num);
    buildFrame(
      "Push Stack",
      10,
      `Pushed ${num} onto the stack.`,
      { i },
      {},
      { num },
    );
  }

  buildFrame(
    "Query nums1 Phase",
    12,
    "Finished building nextGreater map. Now querying results for each element in nums1.",
  );

  for (let j = 0; j < nums1.length; j++) {
    const num1 = nums1[j];
    const greater = nextGreater.get(num1) ?? -1;
    ans.push(greater);

    buildFrame(
      "Lookup Query",
      14,
      `For nums1[${j}] = ${num1}: map lookup is ${
        nextGreater.has(num1) ? greater : "-1 (No greater element)"
      }. ans[${j}] = ${greater}.`,
      {},
      { j },
      { query: num1, result: greater },
    );
  }

  buildFrame(
    "Finished",
    16,
    `Finished constructing answer array [${ans.join(", ")}]. Returning ans.`,
    {},
    {},
    { ans: `[${ans.join(", ")}]` },
  );

  return builder.getFrames();
}

export default generateFrames;
