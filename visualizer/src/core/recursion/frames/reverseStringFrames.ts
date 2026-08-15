import { FrameBuilder } from "../../shared/FrameBuilder";
import type { ArrayFrame, ArrayData } from "../../array/types";

export function generateFrames(initialString: string): ArrayFrame[] {
  const builder = new FrameBuilder<ArrayFrame>();
  
  const s = initialString.split("");
  
  const buildFrame = (
    phase: string, 
    codeLine: number, 
    message: string, 
    left: number, 
    right: number,
    variables: Record<string, string> = {}
  ) => {
    const pointers: Record<string, number> = {};
    if (left >= 0 && left < s.length) pointers["L"] = left;
    if (right >= 0 && right < s.length) pointers["R"] = right;

    const arrays: ArrayData[] = [
      {
        id: "s",
        name: "String Array",
        values: [...s],
        pointers,
      }
    ];

    builder.pushFrame({
      phase,
      codeLine,
      message,
      variables: {
        left: String(left),
        right: String(right),
        ...variables,
      },
      arrays,
    });
  };

  builder.pushFrame({
    phase: "Initialization",
    codeLine: 1,
    message: `Starting reverseString with "${initialString}"`,
    variables: {},
    arrays: [
      {
        id: "s",
        name: "String Array",
        values: [...s],
        pointers: {},
      }
    ]
  });

  builder.executeCall(`reverseString("${initialString}")`, () => {
    function _reverseString(left: number, right: number) {
      builder.pushCall(`reverseString(s, ${left}, ${right})`);
      
      buildFrame("Call", 1, `Entering reverseString with left = ${left}, right = ${right}`, left, right);
      
      buildFrame("Base Case Check", 6, `Checking if left (${left}) > right (${right})`, left, right);
      if (left > right) {
        buildFrame("Base Case", 6, `left > right, returning!`, left, right);
        builder.popCall();
        return;
      }

      const temp = s[left];
      buildFrame("Swap Process", 7, `Store s[${left}] ('${temp}') in temp`, left, right, { temp: `'${temp}'` });
      
      s[left] = s[right];
      buildFrame("Swap Process", 8, `Assign s[${right}] ('${s[right]}') to s[${left}]`, left, right, { temp: `'${temp}'` });
      
      s[right] = temp;
      buildFrame("Swap Process", 9, `Assign temp ('${temp}') to s[${right}]`, left, right, { temp: `'${temp}'` });

      buildFrame("Recursive Call", 10, `Calling reverseString with left = ${left + 1}, right = ${right - 1}`, left, right);
      
      _reverseString(left + 1, right - 1);
      
      // When it returns, we can show a frame
      buildFrame("Return", 10, `Returned from recursive call (left = ${left + 1}, right = ${right - 1})`, left, right);
      builder.popCall();
    }

    _reverseString(0, s.length - 1);
    
    // Final frame without pointers
    builder.pushFrame({
      phase: "Finished",
      codeLine: 11,
      message: `Execution complete. String is now "${s.join("")}".`,
      variables: {},
      arrays: [
        {
          id: "s",
          name: "String Array",
          values: [...s],
          pointers: {},
        }
      ]
    });
  });

  return builder.getFrames();
}
