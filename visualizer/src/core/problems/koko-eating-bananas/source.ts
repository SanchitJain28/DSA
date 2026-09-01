import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function minEatingSpeed(piles, h) {" },
  { line: 2, text: "  let left = 1;" },
  { line: 3, text: "  let right = Math.max(...piles);" },
  { line: 4, text: "  let ans = right;" },
  { line: 5, text: "  while (left <= right) {" },
  { line: 6, text: "    const mid = Math.floor((left + right) / 2);" },
  { line: 7, text: "    let hours = 0;" },
  { line: 8, text: "    for (const p of piles) {" },
  { line: 9, text: "      hours += Math.ceil(p / mid);" },
  { line: 10, text: "    }" },
  { line: 11, text: "    if (hours <= h) {" },
  { line: 12, text: "      ans = mid;" },
  { line: 13, text: "      right = mid - 1;" },
  { line: 14, text: "    } else {" },
  { line: 15, text: "      left = mid + 1;" },
  { line: 16, text: "    }" },
  { line: 17, text: "  }" },
  { line: 18, text: "  return ans;" },
  { line: 19, text: "}" },
];

export default source;
