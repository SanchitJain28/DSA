import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function dailyTemperatures(temperatures) {" },
  { line: 2, text: "  const stack = [];" },
  { line: 3, text: "  const result = new Array(temperatures.length).fill(0);" },
  { line: 4, text: "  for (let i = 0; i < temperatures.length; i++) {" },
  { line: 5, text: "    const currentTemp = temperatures[i];" },
  { line: 6, text: "    while (stack.length && temperatures[stack[stack.length - 1]] < currentTemp) {" },
  { line: 7, text: "      const prevIdx = stack.pop();" },
  { line: 8, text: "      result[prevIdx] = i - prevIdx;" },
  { line: 9, text: "    }" },
  { line: 10, text: "    stack.push(i);" },
  { line: 11, text: "  }" },
  { line: 12, text: "  return result;" },
  { line: 13, text: "}" },
];

export default source;
