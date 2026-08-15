export const dailyTemperaturesCode = [
  {
    line: 1,
    text: "function dailyTemperatures(temperatures: number[]): number[] {",
  },
  { line: 2, text: "  const stack: number[] = [];" },
  {
    line: 3,
    text: "  const result: number[] = new Array(temperatures.length).fill(0);",
  },
  { line: 4, text: "  for (let i = 0; i < temperatures.length; i++) {" },
  { line: 5, text: "    while (" },
  { line: 6, text: "      stack.length &&" },
  {
    line: 7,
    text: "      temperatures[stack[stack.length - 1]] < temperatures[i]",
  },
  { line: 8, text: "    ) {" },
  { line: 9, text: "      const poppedIndex = stack.pop()!;" },
  { line: 10, text: "      result[poppedIndex] = i - poppedIndex;" },
  { line: 11, text: "    }" },
  { line: 12, text: "    stack.push(i);" },
  { line: 13, text: "  }" },
  { line: 14, text: "  return result;" },
  { line: 15, text: "}" },
];
