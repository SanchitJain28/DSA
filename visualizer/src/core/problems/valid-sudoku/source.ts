import type { SourceCodeLine } from "../../shared/types";

export const source: SourceCodeLine[] = [
  { line: 1, text: "function isValidSudoku(board) {" },
  { line: 2, text: "  const rows = Array.from({ length: 9 }, () => new Set());" },
  { line: 3, text: "  const cols = Array.from({ length: 9 }, () => new Set());" },
  { line: 4, text: "  const boxes = Array.from({ length: 9 }, () => new Set());" },
  { line: 5, text: "  for (let r = 0; r < 9; r++) {" },
  { line: 6, text: "    for (let c = 0; c < 9; c++) {" },
  { line: 7, text: "      const val = board[r][c];" },
  { line: 8, text: '      if (val === ".") continue;' },
  { line: 9, text: "      const box = Math.floor(r / 3) * 3 + Math.floor(c / 3);" },
  { line: 10, text: "      if (rows[r].has(val) || cols[c].has(val) || boxes[box].has(val)) {" },
  { line: 11, text: "        return false;" },
  { line: 12, text: "      }" },
  { line: 13, text: "      rows[r].add(val);" },
  { line: 14, text: "      cols[c].add(val);" },
  { line: 15, text: "      boxes[box].add(val);" },
  { line: 16, text: "    }" },
  { line: 17, text: "  }" },
  { line: 18, text: "  return true;" },
  { line: 19, text: "}" },
];

export default source;
