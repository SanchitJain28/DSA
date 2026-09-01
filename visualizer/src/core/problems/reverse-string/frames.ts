import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import type { ArrayData } from "../../structures/array/types";

export function generateFrames(data: { s: string }): Scene[] {
  const builder = new FrameBuilder<Scene>();
  const s = data.s.split("");

  const buildFrame = (
    phase: string,
    codeLine: number,
    explanation: string,
    left: number,
    right: number,
    extraVars: Record<string, string | number> = {},
  ) => {
    const pointers: Record<string, number> = {};
    if (left >= 0 && left < s.length) pointers["L"] = left;
    if (right >= 0 && right < s.length) pointers["R"] = right;

    const arrayData: ArrayData = {
      id: "s",
      name: "String Array",
      values: [...s],
      pointers,
    };

    builder.pushFrame({
      phase,
      codeLine,
      explanation,
      structures: {
        array: arrayData,
      },
      variables: {
        left,
        right,
        ...extraVars,
      },
    });
  };

  // Initial frame
  builder.pushFrame({
    phase: "Initialization",
    codeLine: 1,
    explanation: `Starting reverseString with "${data.s}"`,
    structures: {
      array: {
        id: "s",
        name: "String Array",
        values: [...s],
        pointers: {},
      } as ArrayData,
    },
    variables: {},
  });

  builder.executeCall(`reverseString("${data.s}")`, () => {
    function _reverseString(left: number, right: number) {
      builder.pushCall(`reverseString(s, ${left}, ${right})`);

      buildFrame(
        "Call",
        1,
        `Entering reverseString with left = ${left}, right = ${right}`,
        left,
        right,
      );

      buildFrame(
        "Base Case Check",
        6,
        `Checking if left (${left}) > right (${right})`,
        left,
        right,
      );

      if (left > right) {
        buildFrame("Base Case", 6, `left > right, returning!`, left, right);
        builder.popCall();
        return;
      }

      const temp = s[left];
      buildFrame("Swap Process", 7, `Store s[${left}] ('${temp}') in temp`, left, right, {
        temp: `'${temp}'`,
      });

      s[left] = s[right];
      buildFrame(
        "Swap Process",
        8,
        `Assign s[${right}] ('${s[left]}') to s[${left}]`,
        left,
        right,
        { temp: `'${temp}'` },
      );

      s[right] = temp;
      buildFrame("Swap Process", 9, `Assign temp ('${temp}') to s[${right}]`, left, right, {
        temp: `'${temp}'`,
      });

      buildFrame(
        "Recursive Call",
        10,
        `Calling reverseString with left = ${left + 1}, right = ${right - 1}`,
        left,
        right,
      );

      _reverseString(left + 1, right - 1);

      buildFrame(
        "Return",
        10,
        `Returned from recursive call (left = ${left + 1}, right = ${right - 1})`,
        left,
        right,
      );
      builder.popCall();
    }

    _reverseString(0, s.length - 1);

    builder.pushFrame({
      phase: "Finished",
      codeLine: 11,
      explanation: `Execution complete. String is now "${s.join("")}".`,
      structures: {
        array: {
          id: "s",
          name: "String Array",
          values: [...s],
          pointers: {},
        } as ArrayData,
      },
      variables: {},
    });
  });

  return builder.getFrames();
}

export default generateFrames;
