import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function asteroidCollision(asteroids) {" },
  { line: 2, text: "  const stack = [];" },
  { line: 3, text: "  for (let i = 0; i < asteroids.length; i++) {" },
  { line: 4, text: "    const a = asteroids[i];" },
  { line: 5, text: "    let destroyed = false;" },
  { line: 6, text: "    while (stack.length && a < 0 && stack[stack.length - 1] > 0) {" },
  { line: 7, text: "      const top = stack[stack.length - 1];" },
  { line: 8, text: "      if (top > -a) {" },
  { line: 9, text: "        destroyed = true;" },
  { line: 10, text: "        break;" },
  { line: 11, text: "      } else if (top === -a) {" },
  { line: 12, text: "        destroyed = true;" },
  { line: 13, text: "        stack.pop();" },
  { line: 14, text: "        break;" },
  { line: 15, text: "      } else {" },
  { line: 16, text: "        stack.pop();" },
  { line: 17, text: "      }" },
  { line: 18, text: "    }" },
  { line: 19, text: "    if (!destroyed) stack.push(a);" },
  { line: 20, text: "  }" },
  { line: 21, text: "  return stack;" },
  { line: 22, text: "}" },
];

export default source;
