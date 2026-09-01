import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { toStackState } from "../../structures/stack/helpers";

export function generateFrames(data: { s: string }): Scene[] {
  const { s } = data;
  const builder = new FrameBuilder<Scene>();

  const stack: string[] = [];
  const map: Record<string, string> = {
    ")": "(",
    "}": "{",
    "]": "[",
  };

  const buildFrame = (
    phase: string,
    codeLine: number,
    explanation: string,
    variables: Record<string, string | number> = {},
  ) => {
    builder.pushFrame({
      phase,
      codeLine,
      explanation,
      structures: {
        stack: toStackState([...stack], {
          name: "Brackets Stack (LIFO)",
          topPointer: stack.length > 0,
        }),
      },
      variables: {
        s: `"${s}"`,
        "stack.length": stack.length,
        ...variables,
      },
    });
  };

  buildFrame("Initialization", 1, `Start isValid(s = "${s}").`, {
    i: "N/A",
    char: "N/A",
  });

  buildFrame("Initialize Stack", 2, "Initialize empty stack to store open brackets.", {
    i: "N/A",
    char: "N/A",
  });

  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    buildFrame(
      "Read Character",
      5,
      `Inspecting character s[${i}] = '${char}'.`,
      { i, char },
    );

    if (char in map) {
      buildFrame(
        "Closing Bracket",
        6,
        `'${char}' is a closing bracket. It expects matching open bracket '${map[char]}'.`,
        { i, char, "expected match": map[char] },
      );

      const top = stack.length > 0 ? stack.pop()! : "#";

      buildFrame(
        "Pop Stack Top",
        7,
        stack.length >= 0 && top !== "#"
          ? `Popped top bracket '${top}' from stack to compare.`
          : `Stack is empty! Pop returned '#' placeholder.`,
        { i, char, top, "expected match": map[char] },
      );

      if (top !== map[char]) {
        buildFrame(
          "Mismatch Found",
          9,
          `Mismatch! Top bracket '${top}' !== expected '${map[char]}'. String is INVALID. Returning false.`,
          { i, char, top, expected: map[char], result: "false (Invalid)" },
        );
        return builder.getFrames();
      } else {
        buildFrame(
          "Matched Bracket",
          8,
          `Match confirmed! '${top}' matches '${char}'. Continuing...`,
          { i, char, top, result: "Matched" },
        );
      }
    } else {
      buildFrame(
        "Open Bracket -> Push",
        12,
        `'${char}' is an opening bracket. Pushing onto stack.`,
        { i, char, action: `push('${char}')` },
      );
      stack.push(char);
      buildFrame(
        "Pushed to Stack",
        13,
        `Pushed '${char}'. Current stack depth = ${stack.length}.`,
        { i, char, "stack.length": stack.length },
      );
    }
  }

  const isValid = stack.length === 0;
  buildFrame(
    "Final Check",
    15,
    isValid
      ? "All opening brackets were matched and closed. Stack is empty. Returning true (VALID)."
      : `Stack still contains ${stack.length} unclosed bracket(s) [${stack.join(", ")}]. Returning false (INVALID).`,
    {
      "final stack length": stack.length,
      result: isValid ? "true (Valid)" : "false (Invalid)",
    },
  );

  return builder.getFrames();
}

export default generateFrames;
