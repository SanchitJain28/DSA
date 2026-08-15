function isValidSudoku(board: string[][]): boolean {
  const rows = Array.from({ length: 9 }, () => new Set<string>());
  const cols = Array.from({ length: 9 }, () => new Set<string>());
  const boxes = Array.from({ length: 9 }, () => new Set<string>());
  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < cols.length; c++) {
      const value = board[r][c];
      if (value === ".") continue;
      const box = Math.floor(r / 3) * 3 + Math.floor(c / 3);

      if (rows[r].has(value) || cols[c].has(value) || boxes[box].has(value)) {
        return false;
      }
      rows[r].add(value);
      cols[c].add(value);
      boxes[box].add(value);
    }
  }
  return true;
}
