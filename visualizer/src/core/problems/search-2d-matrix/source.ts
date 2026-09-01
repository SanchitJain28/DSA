import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function searchMatrix(matrix, target) {" },
  { line: 2, text: "  const m = matrix.length;" },
  { line: 3, text: "  const n = matrix[0].length;" },
  { line: 4, text: "  let left = 0, right = m * n - 1;" },
  { line: 5, text: "  while (left <= right) {" },
  { line: 6, text: "    const mid = Math.floor((left + right) / 2);" },
  { line: 7, text: "    const row = Math.floor(mid / n);" },
  { line: 8, text: "    const col = mid % n;" },
  { line: 9, text: "    const val = matrix[row][col];" },
  { line: 10, text: "    if (val === target) {" },
  { line: 11, text: "      return true;" },
  { line: 12, text: "    } else if (val < target) {" },
  { line: 13, text: "      left = mid + 1;" },
  { line: 14, text: "    } else {" },
  { line: 15, text: "      right = mid - 1;" },
  { line: 16, text: "    }" },
  { line: 17, text: "  }" },
  { line: 18, text: "  return false;" },
  { line: 19, text: "}" },
];

export default source;
