function searchMatrix(matrix: number[][], target: number): boolean {
  let m = matrix.length;
  let n = matrix[0].length;
  let total = m * n;
  let left = 0;
  let right = total - 1;
  while (left <= right) {
    let mid = left + Math.floor((right - left) / 2);
    let rowsAndColumn = getColumnAndRows(mid, n);
    let midElement = matrix[rowsAndColumn.rows][rowsAndColumn.columns];
    if (midElement === target) {
      return true;
    } else if (midElement > target) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return false;
}

function getColumnAndRows(
  index: number,
  rowLength: number,
): { rows: number; columns: number } {
  let rows = Math.floor(index / rowLength);
  let columns = index % rowLength;
  return { rows, columns };
}
