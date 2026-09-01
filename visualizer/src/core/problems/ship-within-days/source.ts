import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function shipWithinDays(weights, days) {" },
  { line: 2, text: "  let left = Math.max(...weights);" },
  { line: 3, text: "  let right = weights.reduce((a, b) => a + b, 0);" },
  { line: 4, text: "  while (left < right) {" },
  { line: 5, text: "    const mid = Math.floor((left + right) / 2);" },
  { line: 6, text: "    const reqDays = getDaysNeeded(weights, mid);" },
  { line: 7, text: "    if (reqDays > days) {" },
  { line: 8, text: "      left = mid + 1;" },
  { line: 9, text: "    } else {" },
  { line: 10, text: "      right = mid;" },
  { line: 11, text: "    }" },
  { line: 12, text: "  }" },
  { line: 13, text: "  return left;" },
  { line: 14, text: "}" },
  { line: 15, text: "function getDaysNeeded(weights, cap) {" },
  { line: 16, text: "  let days = 1, currentLoad = 0;" },
  { line: 17, text: "  for (const w of weights) {" },
  { line: 18, text: "    if (currentLoad + w > cap) {" },
  { line: 19, text: "      days++; currentLoad = 0;" },
  { line: 20, text: "    }" },
  { line: 21, text: "    currentLoad += w;" },
  { line: 22, text: "  }" },
  { line: 23, text: "  return days;" },
  { line: 24, text: "}" },
];

export default source;
