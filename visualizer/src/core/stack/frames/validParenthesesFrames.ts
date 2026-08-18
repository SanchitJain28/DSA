import { FrameBuilder } from "../../shared/FrameBuilder";
import type { StackFrame } from "../types";

export function generateFrames(s: string): StackFrame[] {
  const builder = new FrameBuilder<StackFrame>();
  const pairs: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
  const stack: string[] = [];
  const chars = s.split("");

  const getBaseFrame = (
    codeLine: number,
    phase: string,
    message: string,
    variables: Record<string, string | number> = {},
    pointerIdx?: number,
    activeNodeId?: string,
    activeNodeIds?: string[]
  ): StackFrame => {
    return {
      callStack: [],
      phase,
      codeLine,
      message,
      variables,
      activeNodeId,
      activeNodeIds,
      stacks: [
        {
          id: "stack",
          name: "Bracket Stack",
          values: [...stack],
          topPointer: true,
        },
      ],
      arrays: [
        {
          id: "input",
          name: "String s (Characters)",
          values: [...chars],
          pointers: pointerIdx !== undefined ? { ch: pointerIdx } : undefined,
        },
      ],
    };
  };

  // Line 1: Function entry
  builder.pushFrame(
    getBaseFrame(
      1,
      "Initialization",
      `Start isValid() for string s = "${s}" with length ${s.length}.`,
      { s: `"${s}"` }
    )
  );

  // Line 2: Define pairs
  builder.pushFrame(
    getBaseFrame(
      2,
      "Setup",
      `Initialize bracket mapping pairs: { ')': '(', ']': '[', '}': '{' }.`,
      { s: `"${s}"`, pairs: "{')':'(', ']':'[', '}':'{'}" }
    )
  );

  // Line 3: Initialize stack
  builder.pushFrame(
    getBaseFrame(
      3,
      "Setup Stack",
      "Initialize empty stack for tracking unmatched open brackets.",
      { s: `"${s}"`, stack: "[]" }
    )
  );

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];

    // Line 4: for loop iteration
    builder.pushFrame(
      getBaseFrame(
        4,
        "Iteration",
        `Examining character index ${i}: ch = '${ch}'.`,
        {
          i,
          ch: `'${ch}'`,
          stack: JSON.stringify(stack),
        },
        i,
        `input-${i}`
      )
    );

    if (!pairs[ch]) {
      // Opening bracket
      stack.push(ch);

      // Line 5: stack.push(ch)
      builder.pushFrame(
        getBaseFrame(
          5,
          "Push Opening",
          `'${ch}' is an opening bracket. Push onto stack. Stack now: [${stack.join(", ")}].`,
          {
            i,
            ch: `'${ch}'`,
            action: `Push '${ch}'`,
            stack: JSON.stringify(stack),
          },
          i,
          `stack-${stack.length - 1}`
        )
      );
    } else {
      // Closing bracket
      const expectedOpening = pairs[ch];

      // Line 6: else branch
      builder.pushFrame(
        getBaseFrame(
          6,
          "Closing Bracket",
          `'${ch}' is a closing bracket. Must match top opening bracket '${expectedOpening}'.`,
          {
            i,
            ch: `'${ch}'`,
            expected: `'${expectedOpening}'`,
            stack: JSON.stringify(stack),
          },
          i,
          `input-${i}`
        )
      );

      if (stack.length === 0) {
        // Line 7: Pop from empty stack -> Mismatch
        builder.pushFrame(
          getBaseFrame(
            7,
            "Mismatch",
            `Stack is empty! Cannot pop to match closing bracket '${ch}'. Returning false.`,
            {
              i,
              ch: `'${ch}'`,
              expected: `'${expectedOpening}'`,
              popped: "undefined",
              result: "false",
            },
            i,
            `input-${i}`
          )
        );
        return builder.getFrames();
      }

      const popped = stack.pop()!;

      if (popped !== expectedOpening) {
        // Line 7: Mismatch
        builder.pushFrame(
          getBaseFrame(
            7,
            "Mismatch",
            `Mismatch! Popped '${popped}' from stack, but expected '${expectedOpening}' for closing '${ch}'. Returning false.`,
            {
              i,
              ch: `'${ch}'`,
              popped: `'${popped}'`,
              expected: `'${expectedOpening}'`,
              result: "false",
            },
            i,
            `input-${i}`
          )
        );
        return builder.getFrames();
      }

      // Line 7: Valid match
      builder.pushFrame(
        getBaseFrame(
          7,
          "Match Success",
          `Matched! Popped '${popped}' matches closing bracket '${ch}'. Stack now: [${stack.join(", ")}].`,
          {
            i,
            ch: `'${ch}'`,
            popped: `'${popped}'`,
            expected: `'${expectedOpening}'`,
            stack: JSON.stringify(stack),
          },
          i,
          `input-${i}`
        )
      );
    }
  }

  // Line 10: Final check
  const isValidResult = stack.length === 0;
  builder.pushFrame(
    getBaseFrame(
      10,
      "Final Evaluation",
      isValidResult
        ? `All brackets processed and stack is empty (stack.length === 0). Returning true (Valid Parentheses).`
        : `All brackets processed, but stack still contains unclosed brackets: [${stack.join(", ")}]. Returning false.`,
      {
        "stack.length": stack.length,
        result: isValidResult ? "true" : "false",
      }
    )
  );

  return builder.getFrames();
}
