import { FrameBuilder } from "../../shared/FrameBuilder";
import type { ArrayFrame } from "../../array/types";

export function generateFrames(nums: number[], target: number): ArrayFrame[] {
  const builder = new FrameBuilder<ArrayFrame>();

  const getBaseFrame = (
    codeLine: number,
    phase: string,
    message: string,
    variables: Record<string, string | number> = {},
    pointers?: Record<string, number>,
    activeNodeId?: string,
    activeNodeIds?: string[]
  ): ArrayFrame => {
    return {
      callStack: [],
      phase,
      codeLine,
      message,
      variables: {
        target,
        ...variables,
      },
      activeNodeId,
      activeNodeIds,
      arrays: [
        {
          id: "nums",
          name: "nums (Sorted)",
          values: [...nums],
          pointers: pointers ? { ...pointers } : undefined,
        },
      ],
    };
  };

  // Line 1: Function entry
  builder.pushFrame(
    getBaseFrame(
      1,
      "Initialization",
      `Start searchInsert() with nums = [${nums.join(", ")}] and target = ${target}.`,
      { "nums.length": nums.length }
    )
  );

  let left = 0;
  // Line 2: left = 0
  builder.pushFrame(
    getBaseFrame(
      2,
      "Setup Left Pointer",
      `Initialize left pointer = 0 (pointing to index 0, value = ${nums[0]}).`,
      { left },
      { left }
    )
  );

  let right = nums.length - 1;
  // Line 3: right = nums.length - 1
  builder.pushFrame(
    getBaseFrame(
      3,
      "Setup Right Pointer",
      `Initialize right pointer = ${right} (pointing to index ${right}, value = ${nums[right]}).`,
      { left, right },
      { left, right }
    )
  );

  while (left <= right) {
    // Line 4: while condition check
    builder.pushFrame(
      getBaseFrame(
        4,
        "Loop Condition",
        `Check while (left <= right): left (${left}) <= right (${right}) is true. Active search space [${left} ... ${right}].`,
        { left, right, "search window": `[${left}..${right}]` },
        { left, right }
      )
    );

    const mid = Math.floor((left + right) / 2);
    const midVal = nums[mid];

    // Line 5: mid calculation
    builder.pushFrame(
      getBaseFrame(
        5,
        "Calculate Mid",
        `Calculate mid = Math.floor((${left} + ${right}) / 2) = ${mid}. nums[${mid}] = ${midVal}.`,
        { left, right, mid, "nums[mid]": midVal },
        { left, right, mid },
        `nums-${mid}`
      )
    );

    if (midVal < target) {
      // Line 6: if (nums[mid] < target) left = mid + 1
      builder.pushFrame(
        getBaseFrame(
          6,
          "Compare: Less Than",
          `nums[${mid}] (${midVal}) < target (${target}) is TRUE. Target must be in right half. Set left = mid + 1 = ${mid + 1}.`,
          { left, right, mid, "nums[mid]": midVal, comparison: `${midVal} < ${target}` },
          { left, right, mid },
          `nums-${mid}`
        )
      );
      left = mid + 1;
      builder.pushFrame(
        getBaseFrame(
          6,
          "Adjust Left Pointer",
          `Left pointer moved to mid + 1 = index ${left}.`,
          { left, right, mid },
          left < nums.length ? { left, right } : { right }
        )
      );
    } else if (midVal > target) {
      // Line 7: else if (nums[mid] > target) right = mid - 1
      builder.pushFrame(
        getBaseFrame(
          7,
          "Compare: Greater Than",
          `nums[${mid}] (${midVal}) > target (${target}) is TRUE. Target must be in left half. Set right = mid - 1 = ${mid - 1}.`,
          { left, right, mid, "nums[mid]": midVal, comparison: `${midVal} > ${target}` },
          { left, right, mid },
          `nums-${mid}`
        )
      );
      right = mid - 1;
      builder.pushFrame(
        getBaseFrame(
          7,
          "Adjust Right Pointer",
          `Right pointer moved to mid - 1 = index ${right}.`,
          { left, right, mid },
          right >= 0 ? { left, right } : { left }
        )
      );
    } else {
      // Line 8: else return mid
      builder.pushFrame(
        getBaseFrame(
          8,
          "Found Exact Match",
          `Exact match found! nums[${mid}] === ${target}. Returning index ${mid}.`,
          { left, right, mid, "nums[mid]": midVal, result: mid },
          { left, right, mid },
          `nums-${mid}`
        )
      );
      return builder.getFrames();
    }
  }

  // Line 4: Loop termination
  builder.pushFrame(
    getBaseFrame(
      4,
      "Loop Terminated",
      `Search window exhausted: left (${left}) > right (${right}). Target ${target} is not in nums.`,
      { left, right },
      left < nums.length ? { left, right } : { right }
    )
  );

  // Line 10: return left
  builder.pushFrame(
    getBaseFrame(
      10,
      "Return Insertion Index",
      `Returning left = ${left}. Target ${target} should be inserted at index ${left} to preserve sorted order.`,
      { left, right, result: left, "insert index": left },
      left < nums.length ? { insert: left } : undefined,
      left < nums.length ? `nums-${left}` : undefined
    )
  );

  return builder.getFrames();
}
