import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function carFleet(target, position, speed) {" },
  { line: 2, text: "  const cars = position.map((pos, i) => ({ pos, spd: speed[i] }));" },
  { line: 3, text: "  cars.sort((a, b) => b.pos - a.pos);" },
  { line: 4, text: "  const stack = [];" },
  { line: 5, text: "  for (const car of cars) {" },
  { line: 6, text: "    const time = (target - car.pos) / car.spd;" },
  { line: 7, text: "    if (!stack.length || time > stack[stack.length - 1]) {" },
  { line: 8, text: "      stack.push(time);" },
  { line: 9, text: "    }" },
  { line: 10, text: "  }" },
  { line: 11, text: "  return stack.length;" },
  { line: 12, text: "}" },
];

export default source;
